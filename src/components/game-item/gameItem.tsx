import { formatEther } from '@ethersproject/units'
import Sad from "../../img/sad.svg"
import Ok from "../../img/ok.svg"

type IGame = any;

const GameItem = (props: IGame) => {
    
    return (
        <div className="board__header item" key={props.randomNumber}>
            { props.result ? 
                <div className="item__text item__status">
                    <img className="item__icon" src={Ok} alt="" />
                    <div>
                        Won
                    </div>
                </div> :  
                <div className="item__text item__status">
                    <img className="item__icon" src={Sad} alt="" />
                    <div>
                        Lose
                    </div>
                </div>
            }
            <div className="item__text">
                {props.player.slice(0, 5)}....{props.player.slice(-4)}
            </div>
            <div className="item__text">
                {props.percent}
            </div>
            <div className="item__text">
                {Number(formatEther(props.possibleWin)).toFixed(2)}
            </div>
            <div className="item__text">
                {Number(props.randomNumber)}
            </div>
        </div>        
    )
}

export default GameItem;