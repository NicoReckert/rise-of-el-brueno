const groundSrcStable =
    [
        './assets/img/holz_hintergrund.png'
    ]

const townSrcStable =
    [
        './assets/img/Hühnerstall innen.png'
    ]

const stableLevel = new Level(
    {
        grounds:
            [
                // new Ground(groundSrc2[6], -719),
                // new Ground(groundSrc2[6], 0),
                // new Ground(groundSrc2[6], 719),
                // new Ground(groundSrc2[6], -719),
                new Ground(groundSrc2[6], 0, 0, 720, 1280),
                new Ground(groundSrc2[6], 1279, 0, 720, 1280),
            ],
        towns:
            [
                new Town(townSrc2[3], 280, 260, 720, 480)
            ],
        sky:
            [
                new Sky(-719),
                new Sky(-719),
                new Sky(0),
                new Sky(719)
            ]
    }
);