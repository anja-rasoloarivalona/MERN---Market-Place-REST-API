
exports.getAddProduct = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.decription;
    const price = req.body.price;

    res.status(201).json({
        message: 'Product created successfully'
    })


}