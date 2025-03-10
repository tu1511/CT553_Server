const prisma = require("../config/prismaClient");

class RecommendService {

    static async getRecommendBaseOneRatings(accountId) {
        console.log("accountId", accountId);

        // const temp1 = [
        //     { accountId: 3, productId: 32, rating: 5 },
        //     { accountId: 3, productId: 30, rating: 3.5 },
        //     { accountId: 3, productId: 21, rating: 1 },
        //     { accountId: 3, productId: 19, rating: 4 },
        //     { accountId: 4, productId: 32, rating: 2 },
        //     { accountId: 4, productId: 21, rating: 5 },
        //     { accountId: 4, productId: 19, rating: 3 },
        //     { accountId: 2, productId: 32, rating: 3.75 },
        //     { accountId: 2, productId: 30, rating: 4 },
        //     { accountId: 2, productId: 19, rating: 5 },
        //     { accountId: 5, productId: 32, rating: 2 },
        //     { accountId: 5, productId: 30, rating: 4 },
        // ]

        // const temp2 = [
        //     { accountId: 0, productId: 0, rating: 5 },
        //     { accountId: 0, productId: 1, rating: 4 },
        //     { accountId: 0, productId: 3, rating: 2 },
        //     { accountId: 0, productId: 4, rating: 2 },
        //     { accountId: 1, productId: 0, rating: 5 },
        //     { accountId: 1, productId: 2, rating: 4 },
        //     { accountId: 1, productId: 3, rating: 2 },
        //     { accountId: 1, productId: 4, rating: 0 },
        //     { accountId: 2, productId: 0, rating: 2 },
        //     { accountId: 2, productId: 2, rating: 1 },
        //     { accountId: 2, productId: 3, rating: 3 },
        //     { accountId: 2, productId: 4, rating: 4 },
        //     { accountId: 3, productId: 0, rating: 0 },
        //     { accountId: 3, productId: 1, rating: 0 },
        //     { accountId: 3, productId: 3, rating: 4 },
        //     { accountId: 4, productId: 0, rating: 1 },
        //     { accountId: 4, productId: 3, rating: 4 },
        //     { accountId: 5, productId: 1, rating: 2 },
        //     { accountId: 5, productId: 2, rating: 1 },
        //     { accountId: 6, productId: 2, rating: 1 },
        //     { accountId: 6, productId: 3, rating: 4 },
        //     { accountId: 6, productId: 4, rating: 5 },
        // ]

        const temp = await prisma.ratingRecommendation.findMany();

        console.log('temp ', temp);

        let accountIds = temp.map(x => x.accountId);
        accountIds = [...new Set(accountIds)];
        accountIds.sort((a, b) => a - b);
        let productIds = temp.map(x => x.productId);
        productIds = [...new Set(productIds)];
        productIds.sort((a, b) => a - b);

        const n_accounts = accountIds.length;
        const n_products = productIds.length;

        console.log('accountIds ', accountIds);
        console.log('productIds ', productIds);

        // create matrix a
        let a = [];
        for (let i = 0; i < n_products; i++) {
            a[i] = new Array(n_accounts).fill(-1);
            for (let j = 0; j < temp.length; j++) {
                if (temp[j].productId === productIds[i]) {
                    a[i][accountIds.indexOf(temp[j].accountId)] = temp[j].rating;
                }
            }
        }
        console.log('a ', a);

        // calculate mean rating of each user
        let mean = [];
        for (let i = 0; i < accountIds.length; i++) {
            let sum = 0;
            let count = 0;
            for (let j = 0; j < n_products; j++) {
                if (a[j][i] !== -1) {
                    sum += a[j][i];
                    count++;
                }
            }
            mean[i] = sum / count;
        }

        console.log('mean ', mean);

        // normalize matrix a
        let a_norm = [];
        for (let i = 0; i < n_products; i++) {
            a_norm[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] !== -1) {
                    a_norm[i][j] = a[i][j] - mean[j];
                }
            }
        }
        console.log('a_norm ', a_norm);

        // calculate similarity between users
        let sim = [];
        for (let i = 0; i < n_accounts; i++) {
            sim[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (i == j) sim[i][j] = 1;
                if (i !== j) {
                    let sum1 = 0;
                    let sum2 = 0;
                    let sum3 = 0;
                    for (let k = 0; k < n_products; k++) {
                        sum1 += a_norm[k][i] * a_norm[k][j];
                        sum2 += a_norm[k][i] * a_norm[k][i];
                        sum3 += a_norm[k][j] * a_norm[k][j];
                    }
                    console.log('sum1 sum2 sum3 ', sum1, sum2, sum3);
                    // add 1e-9 to avoid division by zero
                    sim[i][j] = sum1 / (Math.sqrt(sum2) * Math.sqrt(sum3) + 1e-9);
                }
            }
        }
        console.log('sim ', sim);

        // calculate rating of user, choose k nearest neighbors
        const k = 5;
        let rating = [];
        for (let i = 0; i < n_products; i++) {
            rating[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] === -1) {
                    let sum1 = 0;
                    let sum2 = 0;
                    let count = 0;


                    // get k nearest neighbors
                    let nearest = [];
                    for (let l = 0; l < n_accounts; l++) {
                        if (l !== j && a[i][l] !== -1) {
                            nearest.push({ index: l, sim: sim[j][l] });
                        }
                    }
                    nearest.sort((a, b) => b.sim - a.sim);
                    nearest = nearest.slice(0, k);

                    // console.log('nearest productId accountId', productIds[i], accountIds[j]);
                    console.log('nearest ', nearest);
                    for (let item of nearest) {
                        console.log('nearest productId accountId', productIds[i], accountIds[item.index], item.sim);
                    }

                    // calculate rating
                    for (let l = 0; l < nearest.length; l++) {
                        sum1 += sim[j][nearest[l].index] * a_norm[i][nearest[l].index];
                        sum2 += Math.abs(sim[j][nearest[l].index]);
                        count++;
                    }
                    // add 1e-9 to avoid division by zero
                    rating[i][j] = Math.min(5, mean[j] + sum1 / (sum2 + 1e-9));
                }
            }
        }
        console.log('rating ', rating);

        // get recommend
        let recommend = [];
        for (let i = 0; i < n_products; i++) {
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] === -1) {
                    recommend.push({ accountId: accountIds[j], productId: productIds[i], rating: rating[i][j] });
                }
            }
        }
        console.log('recommend ', recommend);

        const result = recommend.filter(x => x.accountId === +accountId);
        // sort recommend by rating
        result.sort((a, b) => b.rating - a.rating);
        console.log('result ', result);

        return result;

    }

    static async saveRatingRecommend() {
        // get all reviews 
        const reviews = await prisma.review.findMany();
        const data = [];
        for (let i = 0; i < reviews.length; i++) {
            const accountId = reviews[i].accountId;
            const productId = reviews[i].productId;
            const rating = reviews[i].rating;
            console.log('accountId productId rating ', accountId, productId, rating);
            // if user has rated this product, rating will be updated, count plus 1
            let isExist = false;
            let j = 0;
            for (; j < data.length; j++) {
                if (data[j].accountId === accountId && data[j].productId === productId) {
                    data[j].count++;
                    data[j].rating = (data[j].rating * (data[j].count - 1) + rating) / data[j].count;
                    isExist = true;
                    break;
                }
            }
            if (!isExist) data.push({ accountId, productId, rating, count: 1 });
        }
        console.log('data ', data);

        await prisma.ratingRecommendation.createMany({
            data: data
        });

        return data;
    }

    static async getRecommendBaseOnViewCounts(accountId) {
        console.log("accountId", accountId);

        const temp = await prisma.viewCountRecommendation.findMany();

        console.log('temp ', temp);

        let accountIds = temp.map(x => x.accountId);
        accountIds = [...new Set(accountIds)];
        accountIds.sort((a, b) => a - b);
        let productIds = temp.map(x => x.productId);
        productIds = [...new Set(productIds)];
        productIds.sort((a, b) => a - b);

        const n_accounts = accountIds.length;
        const n_products = productIds.length;

        console.log('accountIds ', accountIds);
        console.log('productIds ', productIds);

        // create matrix a
        let a = [];
        for (let i = 0; i < n_products; i++) {
            a[i] = new Array(n_accounts).fill(-1);
            for (let j = 0; j < temp.length; j++) {
                if (temp[j].productId === productIds[i]) {
                    a[i][accountIds.indexOf(temp[j].accountId)] = temp[j].count;
                }
            }
        }
        console.log('a ', a);

        // calculate mean rating of each user
        let mean = [];
        for (let i = 0; i < accountIds.length; i++) {
            let sum = 0;
            let count = 0;
            for (let j = 0; j < n_products; j++) {
                if (a[j][i] !== -1) {
                    sum += a[j][i];
                    count++;
                }
            }
            mean[i] = sum / count;
        }

        console.log('mean ', mean);

        // normalize matrix a
        let a_norm = [];
        for (let i = 0; i < n_products; i++) {
            a_norm[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] !== -1) {
                    a_norm[i][j] = a[i][j] - mean[j];
                }
            }
        }
        console.log('a_norm ', a_norm);

        // calculate similarity between users
        let sim = [];
        for (let i = 0; i < n_accounts; i++) {
            sim[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (i == j) sim[i][j] = 1;
                if (i !== j) {
                    let sum1 = 0;
                    let sum2 = 0;
                    let sum3 = 0;
                    for (let k = 0; k < n_products; k++) {
                        sum1 += a_norm[k][i] * a_norm[k][j];
                        sum2 += a_norm[k][i] * a_norm[k][i];
                        sum3 += a_norm[k][j] * a_norm[k][j];
                    }
                    console.log('sum1 sum2 sum3 ', sum1, sum2, sum3);
                    // add 1e-9 to avoid division by zero
                    sim[i][j] = sum1 / (Math.sqrt(sum2) * Math.sqrt(sum3) + 1e-9);
                }
            }
        }
        console.log('sim ', sim);

        // calculate counting of user, choose k nearest neighbors
        const k = 5;
        let counting = [];
        for (let i = 0; i < n_products; i++) {
            counting[i] = new Array(n_accounts).fill(0);
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] === -1) {
                    let sum1 = 0;
                    let sum2 = 0;
                    let count = 0;


                    // get k nearest neighbors
                    let nearest = [];
                    for (let l = 0; l < n_accounts; l++) {
                        if (l !== j && a[i][l] !== -1) {
                            nearest.push({ index: l, sim: sim[j][l] });
                        }
                    }
                    nearest.sort((a, b) => b.sim - a.sim);
                    nearest = nearest.slice(0, k);

                    // console.log('nearest productId accountId', productIds[i], accountIds[j]);
                    console.log('nearest ', nearest);
                    for (let item of nearest) {
                        console.log('nearest productId accountId', productIds[i], accountIds[item.index], item.sim);
                    }

                    // calculate counting
                    for (let l = 0; l < nearest.length; l++) {
                        sum1 += sim[j][nearest[l].index] * a_norm[i][nearest[l].index];
                        sum2 += Math.abs(sim[j][nearest[l].index]);
                        count++;
                    }
                    // add 1e-9 to avoid division by zero
                    counting[i][j] = mean[j] + sum1 / (sum2 + 1e-9);
                }
            }
        }
        console.log('counting ', counting);

        // get recommend
        let recommend = [];
        for (let i = 0; i < n_products; i++) {
            for (let j = 0; j < n_accounts; j++) {
                if (a[i][j] === -1) {
                    recommend.push({ accountId: accountIds[j], productId: productIds[i], counting: counting[i][j] });
                }
            }
        }
        console.log('recommend ', recommend);

        const result = recommend.filter(x => x.accountId === +accountId);
        // sort recommend by rating
        result.sort((a, b) => b.count - a.count);
        console.log('result ', result);

        return result;
    }

    static async addViewCountRecommend(accountId, productId) {
        // check if this product has been viewed by this user
        const temp = await prisma.viewCountRecommendation.findFirst({
            where: {
                accountId: accountId,
                productId: productId
            }
        });

        if (temp) {
            await prisma.viewCountRecommendation.update({
                where: {
                    id: temp.id
                },
                data: {
                    count: temp.count + 1
                }
            });
        } else {
            await prisma.viewCountRecommendation.create({
                data: {
                    accountId: accountId,
                    productId: productId,
                    count: 1
                }
            });
        }

        const viewCounts = await prisma.viewCountRecommendation.findMany();
        console.log("viewCounts", viewCounts);
    }

}

module.exports = RecommendService;
