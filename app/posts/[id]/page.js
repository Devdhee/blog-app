import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getPost(id) {
  const postDoc = await getDoc(doc(db, "posts", id));
  if (postDoc.exists()) {
    return { id: postDoc.id, ...postDoc.data() };
  }
  return null;
}

export default async function Post({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 py-6 bg-gray-100 sm:py-12 md:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="mb-2 text-3xl font-semibold text-stone-700">
          {post.title}
        </h1>
        <p className="mb-4 text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose text-stone-700">{post.content}</div>
      </div>
    </div>
  );
}
