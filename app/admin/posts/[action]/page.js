"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { db } from "../../../../lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PostEditor({ params }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const isEditing = params.action !== "new";

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    }
    if (isEditing) {
      fetchPost();
    }
  }, [user, router, isEditing]);

  const fetchPost = async () => {
    const postDoc = await getDoc(
      doc(db, "posts", params.action.split("edit/")[1])
    );
    if (postDoc.exists()) {
      const postData = postDoc.data();
      setTitle(postData.title);
      setContent(postData.content);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateDoc(doc(db, "posts", params.action.split("edit/")[1]), {
        title,
        content,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    router.push("/admin/dashboard");
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen px-4 py-6 bg-gray-100 sm:py-12 md:px-8">
      <button
        className="absolute px-4 py-2 text-blue-800 bg-transparent border border-blue-800 rounded-md top-4 right-6 lg:right-12 hover:bg-blue-800 hover:text-white"
        onClick={handleGoBack}
      >
        Go Back
      </button>
      <div className="w-full max-w-2xl py-3 mx-auto">
        <div className="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-xl mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-stone-600">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form
                onSubmit={handleSubmit}
                className="py-8 space-y-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7"
              >
                <div className="relative">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full h-10 text-sm text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:borer-rose-600"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="title"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Title
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="content"
                    name="content"
                    className="w-full pt-4 text-sm text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer h-60 focus:outline-none focus:borer-rose-600"
                    placeholder="Post content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                  <label
                    htmlFor="content"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Content
                  </label>
                </div>
                <div className="relative">
                  <button className="px-2 py-1 text-white bg-blue-500 rounded-md">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
