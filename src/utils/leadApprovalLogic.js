// src/utils/leadApprovalLogic.js

import { db } from '../firebase';
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

/**
 * Approve a lead in Firestore, then handle:
 * 1) Level/bonus logic
 * 2) Referral logic
 *
 * @param {Object} lead - The lead object (with fields: id, userId, etc.)
 * @param {number} approveAmount - The sale earning amount for this lead
 * @returns {Promise<void>}
 */
export async function handleLeadApproval(lead, approveAmount) {
  if (!lead || !lead.id) {
    throw new Error('Invalid lead data');
  }

  // 1) Mark lead as "approved" + set statusChangeAt
  const leadRef = doc(db, 'leads', lead.id);
  await updateDoc(leadRef, {
    status: 'approved',
    statusChangeAt: Timestamp.now(),
  });

  // 2) Add "sale" earning for the user
  const userId = lead.userId;
  if (!userId) {
    throw new Error('No userId on lead');
  }

  const userEarningsRef = collection(db, 'users', userId, 'earningsHistory');
  await addDoc(userEarningsRef, {
    amount: parseFloat(approveAmount || '0'),
    date: Timestamp.now(),
    leadId: lead.id,
    type: 'sale', // “sale” type
    status: 'unpaid',
    paidAt: null,
  });

  // 3) Check level bonus
  const approvedCountThisMonth = await fetchApprovedLeadsInCurrentMonth(userId);
  await checkAndApplyLevelBonus(userId, approvedCountThisMonth);

  // 4) If first approved lead => check referral
  if (approvedCountThisMonth === 1) {
    await checkAndApplyReferralBonus(userId);
  }
}

/**
 * Count how many leads user has "approved" in the current month.
 */
async function fetchApprovedLeadsInCurrentMonth(userId) {
  const now = new Date();
  const firstDayOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );
  const lastDayOfMonth = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )
  );

  const startTs = Timestamp.fromDate(firstDayOfMonth);
  const endTs = Timestamp.fromDate(lastDayOfMonth);

  const qy = query(
    collection(db, 'leads'),
    where('userId', '==', userId),
    where('status', '==', 'approved'),
    where('statusChangeAt', '>=', startTs),
    where('statusChangeAt', '<=', endTs)
  );
  const snap = await getDocs(qy);

  return snap.size;
}

/**
 * Check if user completed a new Level, then add a "bonus" earning if so.
 * Return the bonus amount if any, else 0.
 */
async function checkAndApplyLevelBonus(userId, approvedCountThisMonth) {
  // Read from "levelEarning"
  const levelData = await getDocs(collection(db, 'levelEarning'));
  let levels = [];
  levelData.forEach((docSnap) => {
    const d = docSnap.data();
    levels.push({
      name: docSnap.id.toLowerCase(),
      leadsRequired: Number(d.leadsRequired || 0),
      earning: Number(d.earning || 0),
    });
  });
  // Sort ascending by leadsRequired
  levels.sort((a, b) => a.leadsRequired - b.leadsRequired);

  let matchedLevel = null;
  for (let lvl of levels) {
    if (approvedCountThisMonth >= lvl.leadsRequired) {
      matchedLevel = lvl;
    } else {
      break;
    }
  }
  if (!matchedLevel) {
    return 0;
  }

  // If user just exactly reached matchedLevel.leadsRequired => award bonus
  if (approvedCountThisMonth === matchedLevel.leadsRequired) {
    const userEarningsRef = collection(db, 'users', userId, 'earningsHistory');
    await addDoc(userEarningsRef, {
      amount: matchedLevel.earning,
      date: Timestamp.now(),
      leadId: '',
      type: 'bonus',
      status: 'unpaid',
      paidAt: null,
    });
    return matchedLevel.earning;
  }

  return 0;
}

/**
 * Check if user was referred by someone. If so, then:
 * 1) set referral doc’s status='approved'
 * 2) add "referral" earning to the referring user’s earningsHistory
 */
async function checkAndApplyReferralBonus(newUserId) {
  const qy = query(
    collection(db, 'referrals'),
    where('referredUserId', '==', newUserId)
  );
  const snap = await getDocs(qy);
  if (snap.empty) return;

  const refDoc = snap.docs[0];
  const referralData = refDoc.data();
  const referralDocRef = doc(db, 'referrals', refDoc.id);

  if (referralData.status === 'approved') {
    return;
  }

  await updateDoc(referralDocRef, {
    status: 'approved',
  });

  // Example referral bonus
  const REFERRAL_BONUS = 500;

  const referringUserId = referralData.referringUserId;
  if (!referringUserId) return;

  const userEarningsRef = collection(db, 'users', referringUserId, 'earningsHistory');
  await addDoc(userEarningsRef, {
    amount: REFERRAL_BONUS,
    date: Timestamp.now(),
    leadId: '',
    type: 'referral',
    status: 'unpaid',
    paidAt: null,
  });
}