const { now } = require('../../utils/toolbox');
const { paginate } = require('../../utils/pagination');
const { listByCenter, addByCenter } = require('./index');
const ExpertCenter = require('../../models/ExpertCenter');
const ExpertCenterComment = require('../../models/ExpertCenterComment');
const { users } = require('../../../__tests__/utils/users.test-utils');
const { centers } = require('../../../__tests__/utils/centers.test-utils');
const { comments } = require('../../../__tests__/utils/comments.test-utils');

jest.mock('../../utils/toolbox');
jest.mock('../../utils/pagination');
jest.mock('../../models/ExpertCenter');
jest.mock('../../models/ExpertCenterComment');

describe('listByCenter', () => {
  const page = 2,
    perPage = 10,
    center = centers[0],
    centerId = 'center-id',
    query = { populate: jest.fn() },
    { name, picture } = users[0],
    populatedComments = comments.map(comment => ({
      ...comment,
      name,
      picture,
      author_center_rate: 5,
    })),
    metas = {
      current_page: page,
      total_count: centers.length,
      page_count: Math.ceil(centers.length / perPage),
    };

  beforeEach(() => {
    ExpertCenter.findById.mockReturnValue({ orFail: async () => center });

    ExpertCenterComment.find.mockResolvedValue(comments);

    paginate.mockResolvedValue({ metas, query });

    query.populate.mockReturnValueOnce(query);
    query.populate.mockResolvedValueOnce(populatedComments);
  });

  it(`
    should find all comments for a center;
    then paginate and return the results; 
    `, async () => {
    // call
    const result = await listByCenter(centerId, page, perPage);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    expect(ExpertCenterComment.find).toHaveBeenCalledWith({
      center_id: center._id,
    });
    expect(paginate).toHaveBeenCalledWith(
      Promise.resolve(query),
      page,
      perPage,
      { updated_at: -1 },
    );
    expect(query.populate).toHaveBeenCalledWith({
      path: 'author',
      select: 'name picture',
    });
    expect(query.populate).toHaveBeenCalledWith({
      path: 'author_center_rate',
      match: { center_id: center._id },
      select: 'value -_id',
    });
    expect(result).toEqual({ ...metas, items: populatedComments });
  });
});

describe('addByCenter', () => {
  const userId = 'user-id',
    centerId = 'center-id',
    center = centers[0],
    text = 'Great center ! Highly recommand.';

  beforeEach(() => {
    ExpertCenter.findById.mockReturnValue({ orFail: async () => center });

    const updatedAt = '2020-03-24T02:27:23.787Z';
    now.mockReturnValue(updatedAt);
  });

  it(`
    should add a comment for a center with information like 'updated at';
    `, async () => {
    // call
    await addByCenter(centerId, userId, text);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    expect(ExpertCenterComment.create).toHaveBeenCalledWith({
      center_id: center._id,
      author: userId,
      updated_at: now(),
      text: text,
    });
  });
});
