import ArticleList from '@/components/ui/ArticleList';
import { connectDB } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';
import { Article } from '@/types/article';

const ArticlePage = async () => {
  await connectDB();
  const initialArticles = await ArticleModel.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const serializedArticles: Article[] = initialArticles.map(article => ({
    ...article,
    _id: article._id.toString(),
  }));

  return (
    <section className="blog-container">
      <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>

      <ArticleList initialArticles={serializedArticles} />
    </section>
  );
};

export default ArticlePage;
