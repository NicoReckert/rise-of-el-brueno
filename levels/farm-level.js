const groundSrcFarm =
    [
        './assets/img/5_background/layers/3_third_layer/1.webp',
        './assets/img/5_background/layers/2_second_layer/1.webp',
        './assets/img/5_background/layers/1_first_layer/1.webp',
        './assets/img/5_background/layers/3_third_layer/2.webp',
        './assets/img/5_background/layers/2_second_layer/2.webp',
        './assets/img/5_background/layers/1_first_layer/2.webp',
        './assets/img/grass3.webp',
        './assets/img/5_background/layers/ground-town.webp',
        './assets/img/5_background/layers/ground-town2.webp',
        './assets/img/5_background/layers/ground-town3.webp'
    ]

const townSrcFarm =
    [
        './assets/img/bauernhof1.webp',
        './assets/img/bauernhof2.webp',
        './assets/img/Hühnerstall 2.webp',
        './assets/img/stable.webp',
        './assets/img/stable2.webp'
    ]

const cloudArray = [];
const cloudCount = 10;
for (let i = 0; i < cloudCount; i++) {
    cloudArray.push(new Cloud(cloudArray, 100)); // 100px Mindestabstand
}

const farmLevel = new Level(
    {
        clouds: cloudArray,

        grounds: [
            new Ground(groundSrcFarm[3], -719),
            new Ground(groundSrcFarm[4], -719),
            new Ground(groundSrcFarm[5], -719),
            new Ground(groundSrcFarm[0], 0),
            new Ground(groundSrcFarm[1], 0),
            new Ground(groundSrcFarm[2], 0),
            new Ground(groundSrcFarm[3], 719),
            new Ground(groundSrcFarm[4], 719),
            new Ground(groundSrcFarm[5], 719),
            new Ground(groundSrcFarm[0], 1438),
            new Ground(groundSrcFarm[1], 1438),
            new Ground(groundSrcFarm[2], 1438),
            new Ground(groundSrcFarm[3], 2157),
            new Ground(groundSrcFarm[4], 2157),
            new Ground(groundSrcFarm[5], 2157),
            new Ground(groundSrcFarm[0], 2876),
            new Ground(groundSrcFarm[1], 2876),
            new Ground(groundSrcFarm[2], 2876),
            new Ground(groundSrcFarm[3], 3595),
            new Ground(groundSrcFarm[4], 3595),
            new Ground(groundSrcFarm[5], 3595),
            new Ground(groundSrcFarm[0], 4314),
            new Ground(groundSrcFarm[1], 4314),
            new Ground(groundSrcFarm[2], 4314),
            new Ground(groundSrcFarm[3], 5033),
            new Ground(groundSrcFarm[4], 5033),
            new Ground(groundSrcFarm[5], 5033),
            new Ground(groundSrcFarm[6], 5033, 575, 100), //115 , 400    // 335, 100 //190, 300
            new Ground(groundSrcFarm[0], 5752),
            new Ground(groundSrcFarm[1], 5752),
            new Ground(groundSrcFarm[2], 5752),
            new Ground(groundSrcFarm[3], 6471),
            new Ground(groundSrcFarm[4], 6471),
            new Ground(groundSrcFarm[5], 6471)
        ],
        towns: [
        // new Town(townSrcFarm[0], 800, -30, 900, 900), // 800, -42, 600, 450
        new Town(townSrcFarm[1], 1290, 324, 300, 400),
        // new Town(townSrcFarm[2], 1600, 70, 400, 400),
        // new Town(townSrcFarm[3], 1550, 177, 600, 600)

        ],
sky: [
    new Sky(-719),
    new Sky(0),
    new Sky(719),
    new Sky(1438),
    new Sky(2157),
    new Sky(2876),
    new Sky(3595),
    new Sky(4314),
    new Sky(5033),
    new Sky(5752),
    new Sky(6471)
],
    });

let calculationXFarm = 1280;
for (let index = 0; index < 66; index++) {
    farmLevel.grounds.push(new Ground(groundSrcFarm[9], `${calculationXFarm}`, 572, 150, 150)); //572
    calculationXFarm = calculationXFarm + 50;
}