const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkUser = require('../middlewares/checkUser');
const { 
    renderPosts, 
    addPost,
    addingPost,
    deletePost,
    detailPost,
    editPost,
    editingPost
} = require('../controllers/posts');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// products
router.get('/', checkUser, renderPosts);
router.get('/add-product', checkUser, addPost);

// add
router.post('/add-product', checkUser, upload.single('image'), addingPost);

//delete
router.get('/delete/:id', checkUser, deletePost);

// details
router.get('/detail/:id', checkUser, detailPost);

// edit
router.get('/edit/:id', checkUser, editPost);
router.post('/editing/:id', checkUser, upload.single('image'), editingPost);


module.exports = router;