const paginate = async (query, pageParam = 1, perPageParam = 5) => {
  const page = parseInt(pageParam);
  const perPage = parseInt(perPageParam);

  const queryBuilder = query.toConstructor();
  const documentsCount = await new queryBuilder().countDocuments();

  return {
    metas: {
      current_page: documentsCount > 0 ? page : 1,
      total_count: documentsCount,
      page_count: documentsCount > 0 ? Math.ceil(documentsCount / perPage) : 1,
    },
    query: new queryBuilder()
      .skip(page > 0 ? (page - 1) * perPage : 0)
      .limit(perPage)
      .sort({ updated_at: -1 }), // TODO see implications
  };
};

module.exports = { paginate };
