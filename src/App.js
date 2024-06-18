import React, { useState } from 'react';
import Editor from './Editor';  // Importér den tidligere definerede Editor komponent

const App = () => {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    // Funktion til at håndtere indsendelsen af et nyt opslag
    const handlePost = () => {
        if (!content.trim()) return;  // Forhindrer tomme opslag
        const newPost = {
            id: posts.length + 1,
            content: content,
            comments: [],
            likes: 0
        };
        setPosts([newPost, ...posts]);  // Tilføjer nyt opslag forrest i listen
        setContent('');  // Ryd editor efter post
    };

    // Like handler
    const handleLike = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
    };

    return (
        <div>
            <Editor setContent={setContent} />
            <button onClick={handlePost}>Opret Opslag</button>
            <div>
                {posts.map(post => (
                    <div key={post.id}>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        <button onClick={() => handleLike(post.id)}>Like</button>
                        <span>{post.likes} Likes</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
