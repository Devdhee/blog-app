"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    } else {
      fetchPosts();
    }
  }, [user, router]);

  const fetchPosts = async () => {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsList);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posts", id));
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center flex-shrink-0">
                <h1 className="text-xl font-bold text-stone-600">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Post
          </Link>
          <div className="mt-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="mb-4 overflow-hidden bg-white shadow sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {post.title}
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Content
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {post.content.substring(0, 100)}...
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <Link
                    href={`/admin/posts/edit/${post.id}`}
                    className="inline-flex items-center px-4 py-2 mr-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
