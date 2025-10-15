const groundSrcTown =
    [
        './assets/img/5_background/layers/3_third_layer/1.webp',
        './assets/img/5_background/layers/2_second_layer/1.webp',
        './assets/img/5_background/layers/1_first_layer/1.webp',
        './assets/img/5_background/layers/3_third_layer/2.webp',
        './assets/img/5_background/layers/2_second_layer/2.webp',
        './assets/img/5_background/layers/1_first_layer/2.webp',
        './assets/img/5_background/layers/ground-town.webp',
        './assets/img/5_background/layers/ground-town2.webp'
    ]

const townSrcTown =
    [
        './assets/img/town1.webp',
        './assets/img/town2.webp',
        './assets/img/town3.webp',
        './assets/img/town4.webp',
        './assets/img/town5.webp',
        './assets/img/town6.webp',
        './assets/img/house-weise.png'

    ]

let townLevel = null;

function createTownLevel(entityImages) {
    townLevel = new Level(
        {
            enemies:
                [
                    new Chicken(entityImages),
                    new Chicken(entityImages),
                    new Chicken(entityImages)

                ],
            clouds:
                [
                    new Cloud
                ],
            grounds:
                [
                    // new Ground(groundSrcTown[3], -719),
                    // new Ground(groundSrcTown[4], -719),
                    // new Ground(groundSrcTown[5], -719),
                    // new Ground(groundSrcTown[0], 0),
                    // new Ground(groundSrcTown[1], 0),
                    // new Ground(groundSrcTown[2], 0),
                    // new Ground(groundSrcTown[3], 719),
                    // new Ground(groundSrcTown[4], 719),
                    // new Ground(groundSrcTown[5], 719),
                    // new Ground(groundSrcTown[0], 1438),
                    // new Ground(groundSrcTown[1], 1438),
                    // new Ground(groundSrcTown[2], 1438),
                    // new Ground(groundSrcTown[3], 2157),
                    // new Ground(groundSrcTown[4], 2157),
                    // new Ground(groundSrcTown[5], 2157),
                    // new Ground(groundSrcTown[0], 2876),
                    // new Ground(groundSrcTown[1], 2876),
                    // new Ground(groundSrcTown[2], 2876),
                    // new Ground(groundSrcTown[3], 3595),
                    // new Ground(groundSrcTown[4], 3595),
                    // new Ground(groundSrcTown[5], 3595),
                    // new Ground(groundSrcTown[0], 4314),
                    // new Ground(groundSrcTown[1], 4314),
                    // new Ground(groundSrcTown[2], 4314),
                    // new Ground(groundSrcTown[3], 5033),
                    // new Ground(groundSrcTown[4], 5033),
                    // new Ground(groundSrcTown[5], 5033),
                    // new Ground(groundSrcTown[0], 5752),
                    // new Ground(groundSrcTown[1], 5752),
                    // new Ground(groundSrcTown[2], 5752),
                    // new Ground(groundSrcTown[3], 6471),
                    // new Ground(groundSrcTown[4], 6471),
                    // new Ground(groundSrcTown[5], 6471),
                    // new Ground(groundSrcTown[0], 7190),
                    // new Ground(groundSrcTown[1], 7190),
                    // new Ground(groundSrcTown[2], 7190),
                    // new Ground(groundSrcTown[3], 7909),
                    // new Ground(groundSrcTown[4], 7909),
                    // new Ground(groundSrcTown[5], 7909)
                ],
            towns:
                [
                    new Town(townSrcTown[6], 10000, 275, 550, 450),
                    new Town(townSrcTown[0], 18676, 5, 1000, 800),
                    new Town(townSrcTown[1], 19618, -105, 1000, 1000),
                    // new Town(townSrcTown[2], 3160, 25, 800, 800),
                    new Town(townSrcTown[3], 20523, -35, 800, 800),
                    new Town(townSrcTown[4], 21338, -18, 800, 800),
                    new Town(townSrcTown[5], 22038, -17, 1000, 800)
                ],
            sky:
                [
                    // new Sky(-719),
                    // new Sky(0),
                    // new Sky(719),
                    // new Sky(1438),
                    // new Sky(2157),
                    // new Sky(2876),
                    // new Sky(3595),
                    // new Sky(4314),
                    // new Sky(5033),
                    // new Sky(5752),
                    // new Sky(6471),
                    // new Sky(7190),
                    // new Sky(7909)
                ],
            coins:
                [
                    new Coin(entityImages),
                    new Coin(entityImages),
                    new Coin(entityImages),
                    new Coin(entityImages),
                    new Coin(entityImages),
                    new Coin(entityImages)
                ],
            bottles:
                [
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages),
                    new Bottle(entityImages)
                ]
        }


    );

    let groundX = [];
    let start = -719;
    let step = 719;
    let count = 35;

    for (let i = 0; i < count; i++) {
        groundX.push(start + i * step);
    }
    // let groundX = [-719, 0, 719, 1438, 2157, 2876, 3595, 4314, 5033, 5752, 6471, 7190, 7909];
    let groundFrames = [
        [3, 4, 5],
        [0, 1, 2]
    ];

    for (let index = 0; index < groundX.length; index++) {
        let frameGroup = groundFrames[index % 2];
        townLevel.sky.push(new Sky(groundX[index]));
        for (let frame of frameGroup) {
            townLevel.grounds.push(new Ground(groundSrcTown[frame], groundX[index]));
        }
    }

    let calculationX = 18676
    for (let index = 0; index < 41; index++) {
        townLevel.grounds.push(new Ground(groundSrcTown[7], `${calculationX}`, 572, 150, 300));
        calculationX = calculationX + 100;
    }
}
