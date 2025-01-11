const { reviewImage } = require("../config/prismaClient");

const commonIncludeOptionsInReview = {
    orderDetail: {
        include: {
            variant: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            thumbnailImage: {
                                select: {
                                    path: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    account: {
        select: {
            id: true,
            fullName: true,
            avatar: {
                select: {
                    path: true,
                },
            }
        },
    },
    reviewImage: {
        select: {
            id: true,
            image: {
                select: {
                    id: true,
                    path: true,
                },
            },
        },
    },
    // this is an array of review, we want to include the reviewImage of each review
    replyByReview: {
        include: {
            account: {
                select: {
                    id: true,
                    fullName: true,
                    avatar: {
                        select: {
                            path: true,
                        },
                    }
                },
            },
            reviewImage: {
                select: {
                    id: true,
                    image: {
                        select: {
                            id: true,
                            path: true,
                        },
                    },
                },

            },
        }
    },

};

module.exports = {
    commonIncludeOptionsInReview,
};