import { formatEther } from '@ethersproject/units'
import Sad from "../../img/sad.svg"
import Happy from "../../img/happy.svg"
import copyIcon from "../../img/copy.svg"
import copy from 'copy-to-clipboard';
import { toast } from "react-toastify";

type IGame = any;

const GameItem = (props: IGame) => {

    function copyToClipboard() {
        copy(props.player);
        toast.info('Copied', {
            position: "bottom-center",
            autoClose: 100,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
        return;
    }

    return (
        <div className="board__header item" key={props.randomNumber}>
            { props.result ? 
                <div className="item__text item__status">
                    <img className="item__icon" src={Happy} alt="" />
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
                {props.percent}
            </div>
            <div className="item__text">
                {Number(formatEther(props.possibleWin)).toFixed(2)}
            </div>
            <div className="item__text">
                {Number(props.randomNumber)}
            </div>
            <div className="item__address">
                <div className="item__text">
                    {props.player.slice(0, 5)}....{props.player.slice(-4)}
                </div>
                <div className="item__copy" onClick={() => {copyToClipboard()}}>
                    <img src={copyIcon} alt="copy icon"/>
                </div>
            </div>
        </div>        
    )
}

export default GameItem;