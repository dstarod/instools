exports.convertRawUser = function (user) {
    return {
        key: user.pk,
        id: user.pk,
        name: user.username,
        full_name: user.full_name,
        avatar: user.profile_pic_url,
        private: user.is_private,
        followed: user.followed,
        is_new: user.new,
    };
};