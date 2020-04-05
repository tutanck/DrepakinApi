const ExpertCenter = require('../../models/ExpertCenter');
const { enrichEc, enrichEcList } = require('./enrich');
const { paginate } = require('../../utils/pagination');
const {
  list,
  details,
  adminDetails,
  near,
  create,
  update,
} = require('./index');
const { now } = require('../../utils/toolbox');
const { centers } = require('../../../__tests__/utils/centers.test-utils');

jest.mock('./enrich');
jest.mock('../../utils/toolbox');
jest.mock('../../utils/pagination');
jest.mock('../../models/ExpertCenter');

describe('list', () => {
  const page = 2,
    perPage = 10,
    userId = 'user-id',
    query = Promise.resolve(centers),
    metas = {
      current_page: page,
      total_count: centers.length,
      page_count: Math.ceil(centers.length / perPage),
    },
    enrichment = {
      richProperty1: 'richValue1',
      richProperty2: 'richValue2',
      richProperty3: 'richValue3',
    };

  let enrichEcListCallback;

  beforeEach(() => {
    ExpertCenter.find.mockResolvedValue(centers);

    paginate.mockResolvedValue({ metas, query });

    enrichEcListCallback = jest.fn();

    enrichEcListCallback.mockImplementation(async list =>
      list.map(el => ({ ...el, ...enrichment })),
    );

    enrichEcList.mockReturnValue(enrichEcListCallback);
  });

  it(`
    should find all centers;
    then paginate the results; 
    then enrich the paginated results;
    `, async () => {
    // call
    const result = await list(page, perPage, userId);

    // expectations
    expect(ExpertCenter.find).toHaveBeenCalledWith();
    expect(paginate).toHaveBeenCalledWith(query, page, perPage, {
      updated_at: -1,
    });
    expect(enrichEcList).toHaveBeenCalledWith(userId);
    expect(enrichEcListCallback).toHaveBeenCalledWith(centers);
    expect(result).toEqual({
      ...metas,
      items: centers.map(center => ({ ...center, ...enrichment })),
    });
  });
});

describe('details', () => {
  const centerId = 'center-id',
    userId = 'user-id',
    center = centers[0],
    enrichment = {
      richProperty1: 'richValue1',
      richProperty2: 'richValue2',
      richProperty3: 'richValue3',
    };

  let enrichEcCallback;

  beforeEach(() => {
    ExpertCenter.findById.mockReturnValue({ orFail: async () => center });

    enrichEcCallback = jest.fn();

    enrichEcCallback.mockImplementation(async el => ({ ...el, ...enrichment }));

    enrichEc.mockReturnValue(enrichEcCallback);
  });

  it(`
    should find a center by its _id;    
    then enrich the retrieved center;
    `, async () => {
    // call
    const result = await details(centerId, userId);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    expect(enrichEc).toHaveBeenCalledWith(userId);
    expect(enrichEcCallback).toHaveBeenCalledWith(center);
    expect(result).toEqual({ ...center, ...enrichment });
  });
});

describe('adminDetails', () => {
  const centerId = 'center-id',
    center = centers[0];

  beforeEach(() => {
    ExpertCenter.findById.mockReturnValue({
      orFail: () => ({ lean: async () => center }),
    });
  });

  it(`
    should find a center by its _id;    
    then return the retrieved center without its _id and __v properties;
    `, async () => {
    // call
    const result = await adminDetails(centerId);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, ...lightCenter } = center;
    expect(result).toEqual(lightCenter);
  });
});

describe('near', () => {
  const page = 2,
    perPage = 10,
    userId = 'user-id',
    latitude = 51.4494365,
    longitude = -0.9571647000000001,
    metas = {
      current_page: page,
      total_count: centers.length,
      page_count: Math.ceil(centers.length / perPage),
    },
    enrichment = {
      richProperty1: 'richValue1',
      richProperty2: 'richValue2',
      richProperty3: 'richValue3',
    };
  const geoNearStage = {
    $geoNear: {
      key: 'location',
      spherical: true,
      distanceMultiplier: 0.001, // from meter to kilometer
      distanceField: 'dist.calculated',
      near: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
    },
  };

  let enrichEcListCallback;

  beforeEach(() => {
    ExpertCenter.aggregate.mockResolvedValueOnce([
      { documentsCount: centers.length },
    ]);

    ExpertCenter.aggregate.mockResolvedValueOnce(centers);

    enrichEcListCallback = jest.fn();

    enrichEcListCallback.mockImplementation(async list =>
      list.map(el => ({ ...el, ...enrichment })),
    );

    enrichEcList.mockReturnValue(enrichEcListCallback);
  });

  it(`
    should find all centers;
    then paginate the results; 
    then enrich the paginated results;
    `, async () => {
    // call
    const result = await near(longitude, latitude, page, perPage, userId);

    // expectations
    expect(ExpertCenter.aggregate.mock.calls.length).toBe(2);
    expect(ExpertCenter.aggregate).toHaveBeenCalledWith([
      geoNearStage,
      { $count: 'documentsCount' },
    ]);
    expect(ExpertCenter.aggregate).toHaveBeenCalledWith([
      geoNearStage,
      { $skip: page > 0 ? (page - 1) * perPage : 0 },
      { $limit: perPage },
      { $addFields: { id: '$_id' } },
    ]);
    expect(enrichEcList).toHaveBeenCalledWith(userId);
    expect(enrichEcListCallback).toHaveBeenCalledWith(centers, false);
    expect(result).toEqual({
      ...metas,
      items: centers.map(center => ({ ...center, ...enrichment })),
    });
  });
});

describe('create', () => {
  const userId = 'user-id',
    center = centers[0];

  beforeEach(() => {
    const updatedAt = '2020-03-24T02:27:23.787Z';
    now.mockReturnValue(updatedAt);
  });

  it(`
    should create a center with informations like 'updated at' and 'updated by';
    `, async () => {
    // call
    await create(userId, center);

    // expectations
    expect(ExpertCenter.create).toHaveBeenCalledWith({
      ...center,
      infos: { updated_at: now(), updated_by: userId },
    });
  });
});

describe('update', () => {
  const centerId = 'center-id',
    userId = 'user-id',
    center = centers[0];

  beforeEach(() => {
    const updatedAt = '2020-06-14T02:27:23.787Z';
    now.mockReturnValue(updatedAt);

    ExpertCenter.findOneAndUpdate.mockReturnValue({
      orFail: async () => center,
    });
  });

  it(`
    should update an existing center including information like 'updated  at' and 'updated by';
    `, async () => {
    // call
    await update(centerId, userId, center);

    // expectations
    expect(ExpertCenter.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: centerId },
      {
        ...center,
        infos: { updated_at: now(), updated_by: userId },
      },
      { new: true, runValidators: true },
    );
  });
});
