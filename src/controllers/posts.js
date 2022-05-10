const Post = require('../models/Post');

const renderPosts = async (req, res) => {
    try {
        const posts = await Post.find({user: req.user.id});
        return res.render('home', { posts });
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }
}

const addPost = (req, res) => {
    return res.render('addPost');
}

// add post
const addingPost = async (req, res) => {
    const { name, date, description } = req.body;
    
    try {
        if(name.length === 0 || !name.trim() || name === 'undefined') throw new Error('Invalid name');
        if(date.length === 0 || !date.trim() || date === 'null') throw new Error('Invalid date');
        if(description.length === 0 || !description.trim() || description === 'undefined') throw new Error('Invalid description');
    
        const post = new Post({ name, date, description, image: req.file.filename, user: req.user.id });
        await post.save();

        return res.redirect('/');
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }
}

// delete post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if(!post.user.equals(req.user.id)) throw new Error('An error occurred');
        
        await post.remove();
        return res.redirect('/');
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }
}

// details post
const detailPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if(!post) throw new Error('An error occured');

        return res.render('detailPost', { post });
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }    
}

// edit post
const editPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if(!post.user.equals(req.user.id)) throw new Error('An error occurred');

        return res.render('editPost', { post });
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }
}

const editingPost = async (req, res) => {
    const { id } = req.params;
    const { name, date, description } = req.body;

    try {
        if(name.length === 0 || !name.trim() || name === undefined) throw new Error('Invalid name');
        if(date.length === 0 || !date.trim() || date === null) throw new Error('Invalid date');
        if(description.length === 0 || !description.trim() || description === undefined) throw new Error('Invalid description');

        const post = await Post.findById(id);
        if(!post.user.equals(req.user.id)) throw new Error('An error occurred');
        
        await post.updateOne({ name, description, date, image: req.file.filename });
        return res.redirect('/');
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/');
    }
}

module.exports = {
    renderPosts,
    addPost,
    addingPost,
    deletePost,
    detailPost,
    editPost,
    editingPost
}