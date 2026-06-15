const DRIVE_CACHE_KEY = 'jobPortal_driveCache';
const APPLICATIONS_KEY = 'jobPortal_applications';

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('localStorage parse error:', error);
    return fallback;
  }
};

const getDriveCacheStore = () => {
  const parsed = safeParse(localStorage.getItem(DRIVE_CACHE_KEY), {});
  if (Array.isArray(parsed)) {
    return { default: parsed };
  }
  return parsed || {};
};

export const getDriveCache = (userId) => {
  if (!userId) return [];
  const store = getDriveCacheStore();
  return store[`${userId}`] || [];
};

export const setDriveCache = (userId, drives) => {
  if (!userId) return;
  const store = getDriveCacheStore();
  store[`${userId}`] = drives || [];
  localStorage.setItem(DRIVE_CACHE_KEY, JSON.stringify(store));
};
// Migrate any drives stored under the legacy `default` bucket into the
// current user's bucket if they belong to that user (by createdBy/adminId).
export const migrateDefaultDriveCacheForUser = (userId) => {
  if (userId === undefined || userId === null) return;
  const store = getDriveCacheStore();
  const defaultDrives = Array.isArray(store.default) ? store.default : (store['default'] || []);
  if (!Array.isArray(defaultDrives) || defaultDrives.length === 0) return;

  const matching = defaultDrives.filter((d) => {
    const ownerIds = [d.createdBy, d.adminId].filter((id) => id !== undefined && id !== null);
    return ownerIds.some((id) => `${id}` === `${userId}`);
  });

  if (!matching.length) return;

  const userKey = `${userId}`;
  const existing = store[userKey] || [];
  // Remove matched drives from default
  const remainingDefault = defaultDrives.filter((d) => !matching.includes(d));
  store[userKey] = [...existing, ...matching];
  if (remainingDefault.length) {
    store['default'] = remainingDefault;
  } else {
    delete store['default'];
  }
  localStorage.setItem(DRIVE_CACHE_KEY, JSON.stringify(store));
};

export const getDriveById = (userId, driveId) => {
  if (!userId || !driveId) return null;
  return getDriveCache(userId).find((drive) => `${drive.driveId}` === `${driveId}`) || null;
};

export const removeDriveFromCache = (userId, driveId) => {
  if (!userId) return [];
  const drives = getDriveCache(userId).filter((drive) => `${drive.driveId}` !== `${driveId}`);
  setDriveCache(userId, drives);
  return drives;
};

export const getApplicationStore = () => {
  const parsed = safeParse(localStorage.getItem(APPLICATIONS_KEY), {});
  if (Array.isArray(parsed)) {
    return { default: parsed };
  }
  return parsed || {};
};

const flattenApplicationStore = (store) => {
  if (Array.isArray(store)) {
    return store;
  }
  return Object.values(store).flat();
};

export const getAllStoredApplications = () => getApplicationStore();
export const getAllStoredApplicationsArray = () => flattenApplicationStore(getApplicationStore());

export const saveAllApplications = (applicationsByUser) => {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applicationsByUser || {}));
};

export const getApplicationsForUser = (userId) => {
  if (!userId) return [];
  const applications = getAllStoredApplicationsArray();
  return applications.filter((app) => `${app.userId}` === `${userId}`);
};

export const getApplicationByUserAndDrive = (userId, driveId) => {
  if (!userId || !driveId) return null;
  return getApplicationsForUser(userId).find((app) => `${app.driveId}` === `${driveId}`) || null;
};

export const getApplicationsForDriveIds = (driveIds = []) => {
  if (!Array.isArray(driveIds) || driveIds.length === 0) return [];
  const applications = getAllStoredApplicationsArray();
  return applications.filter((app) => driveIds.some((driveId) => `${driveId}` === `${app.driveId}`));
};

export const getTotalApplicationsForDriveIds = (driveIds = []) => getApplicationsForDriveIds(driveIds).length;

export const getConversionRateForDriveIds = (driveIds = []) => {
  const totalDrives = driveIds.length;
  if (totalDrives === 0) return 0;
  return Math.round((getTotalApplicationsForDriveIds(driveIds) / totalDrives) * 100);
};

export const addApplicationForUser = (userId, drive) => {
  if (!userId || !drive) return null;

  let applicationsByUser = getAllStoredApplications();
  if (Array.isArray(applicationsByUser)) {
    const migrated = applicationsByUser.reduce((acc, app) => {
      const key = `${app.userId}`;
      acc[key] = acc[key] || [];
      acc[key].push(app);
      return acc;
    }, {});
    applicationsByUser = migrated;
  }

  const userKey = `${userId}`;
  const userApplications = applicationsByUser[userKey] || [];

  const driveId = drive.driveId ?? drive.id ?? null;
  const existing = userApplications.find((app) => `${app.driveId}` === `${driveId}`);
  if (existing) return null;

  const applicationId = `app_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const application = {
    applicationId,
    id: applicationId,
    userId,
    driveId: driveId,
    jobTitle: drive.title || drive.jobTitle || '',
    companyName: drive.companyName || drive.company || '',
    companyLocation: `${drive.city || drive.location || ''} ${drive.venue || ''}`.trim(),
    qualificationRequired: drive.qualificationRequired,
    experienceRequired: drive.experienceRequired,
    appliedDate: new Date().toISOString(),
    status: 'Applied',
  };

  const updatedUserApplications = [...userApplications, application];
  applicationsByUser[userKey] = updatedUserApplications;
  saveAllApplications(applicationsByUser);
  return application;
};

export const getTotalApplicationsCount = () => getAllStoredApplicationsArray().length;

export const clearApplicationStorage = () => localStorage.removeItem(APPLICATIONS_KEY);
export const clearDriveCache = () => localStorage.removeItem(DRIVE_CACHE_KEY);
export const clearLocalStorageData = () => {
  clearApplicationStorage();
  clearDriveCache();
};

// Drive stats (per-user counters)
const DRIVE_STATS_KEY = 'jobPortal_driveStats';
const getDriveStatsStore = () => safeParse(localStorage.getItem(DRIVE_STATS_KEY), {});

export const getClosedCount = (userId) => {
  if (userId === undefined || userId === null) return 0;
  const store = getDriveStatsStore();
  const rec = store[`${userId}`] || {};
  return Number(rec.closed || 0);
};

export const incrementClosedCount = (userId, by = 1) => {
  if (userId === undefined || userId === null) return 0;
  const store = getDriveStatsStore();
  const key = `${userId}`;
  const rec = store[key] || { closed: 0 };
  rec.closed = (Number(rec.closed || 0) + Number(by));
  store[key] = rec;
  localStorage.setItem(DRIVE_STATS_KEY, JSON.stringify(store));
  return rec.closed;
};

export const resetClosedCount = (userId) => {
  if (userId === undefined || userId === null) return;
  const store = getDriveStatsStore();
  delete store[`${userId}`];
  localStorage.setItem(DRIVE_STATS_KEY, JSON.stringify(store));
};
