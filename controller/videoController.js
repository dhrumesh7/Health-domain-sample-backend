const { User } = require('../models/userModel');
const { Video } = require('../models/videoModel');


const { addVideoValidation } = require('../services/validationService');


const addVideo = async (req, res) => {
    try {
        req.body.thumbnail = req?.files?.thumbnail?.[0]?.key;
        req.body.video = req?.files?.video?.[0]?.key;

        const { error } = addVideoValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        const video = new Video(req.body);

        await video.save()
        return res.status(200).json({
            flag: true,
            data: video
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getVideo = async (req, res) => {
    try {
        const user = req.user;
        const page = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;

        const videos = await Video.paginate({}, { page, limit, sort: { createdAt: -1 } });

        const updated = videos?.docs?.map(video => {
            const videoCopy = JSON.parse(JSON.stringify(video));
            videoCopy.isLiked = user?.likedVideo?.includes(video._id)
            return videoCopy
        });

        return res.status(200).json({
            flag: true,
            data: updated
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const videoLike = async (req, res) => {
    try {
        const user = req.user;
        const { videoId, type } = req.body;
        if (user?.likedVideo?.find(id => id.toString() === videoId) && type === 'like') return res.status(409).json({
            flag: false,
            message: 'This video already liked!'
        });

        if (!user?.likedVideo?.find(id => id.toString() === videoId) && type !== 'like') return res.status(409).json({
            flag: false,
            message: 'This video already not liked!'
        });

        const userAction = type === 'like' ? { $push: { likedVideo: videoId } } : { $pull: { likedVideo: videoId } };
        const videoAction = type === 'like' ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };

        await User.findOneAndUpdate({ _id: user._id }, userAction, { new: true });
        const video = await Video.findOneAndUpdate({ _id: videoId, $gte: 0 }, videoAction, { new: true });

        return res.status(200).json({
            flag: true,
            data: video
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}
module.exports = {
    addVideo,
    getVideo,
    videoLike
}