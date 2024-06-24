import Phaser from 'phaser';
import React from 'react';
import GameComponent from './GameComponent';

const sizes = {
  width: 1140,
  height: 600
};

const speedDown = 200;

class GameScene extends Phaser.Scene
    {
        constructor() {
          super("scene-game");
          this.player
          this.target
          this.cursor
          this.playerSpeed=speedDown+50;
        }
        preload ()
        {
            this.load.image("background", "/images/background.png");
            this.load.spritesheet('ship', '/images/ship.png', { frameWidth:64, frameHeight:64});
            this.load.spritesheet('target', '/images/monster_lvl1.png', { frameWidth:64, frameHeight:80});
            this.load.spritesheet('target2', '/images/monster_lvl2.png', { frameWidth:64, frameHeight:80});
            this.load.spritesheet('target3', '/images/monster_lvl3.png', { frameWidth:64, frameHeight:64});

            console.log(import.meta.env.VITE_APP_DEBUG);
        }

        create ()
        {
            // this.add.image(400, 300, "background")
            this.background = this.add.tileSprite(570, 300, sizes.width, sizes.height, 'background');

            /////// Ship physics
            this.player = this.physics.add.image(50, 300, 'ship').setOrigin(0, 0);
            this.player.setImmovable(true);
            this.player.body.allowGravity = false;
            this.player.setCollideWorldBounds(true);


            /////// Target physics
            this.target = this.physics.add.image(950, 300, 'target').setOrigin(0, 0);
            this.target.body.allowGravity = false;

            this.target2 = this.physics.add.image(450, 100, 'target2').setOrigin(0, 0);
            this.target2.body.allowGravity = false;

            this.cursor = this.input.keyboard?.createCursorKeys();

            this.physics.add.collider(this.player, this.target, function(player, target){
                player.destroy();
            });
            this.physics.add.collider(this.player, this.target2, function(player, target){
              player.destroy();
            });
            

            // const logo = this.physics.add.image(400, 100, 'logo');

            // logo.setVelocity(100, 200);
            // logo.setBounce(1, 1);  
            // logo.setCollideWorldBounds(true);
        }

        update(){
          const {up, down} = this.cursor;

          this.background.tilePositionX += 1;

          // this.target.setVelocityX(-this.playerSpeed);
          this.enemyMove(this.target, this.playerSpeed);
          this.enemyMove(this.target2, this.playerSpeed);

          // Logic for colition

          if(up.isDown){
            this.player.setVelocityY(-this.playerSpeed);
            } else if(down.isDown){
            this.player.setVelocityY(this.playerSpeed);
          } else {
            this.player.setVelocityY(0);
          }
        }

        enemyMove(enemy, speed){
          enemy.setVelocityX(-speed);
          if(enemy.x < 0){
            this.resetEnemyPosition(enemy);
          }
        }

        resetEnemyPosition(enemy){
          enemy.x = sizes.width;
          enemy.y = Phaser.Math.Between(0, sizes.height);
        }

        randomSpeedNumber(max){
          return Phaser.Math.Between(0, max)
        }
    }

function HomeComponent() {
  const config = {
    type: Phaser.WEBGL,
    parent: 'game-div',
    width: sizes.width,
    height: sizes.height,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: speedDown },
            debug: import.meta.env.VITE_APP_DEBUG,
        }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <GameComponent config={config} />
    </div>
  );
}

export default HomeComponent;
