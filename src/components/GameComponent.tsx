import React, { useEffect } from 'react';

const GameComponent = ({config}) => {
    useEffect(() => {
        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };

    },[]);
  
  return (
    <div id='game-div'>
    </div>
  );
};

export default GameComponent;
