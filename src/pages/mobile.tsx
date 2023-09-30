import MiniLogo from "./../img/MiniLogo.svg"
import Telegram from "./../img/Telegram.svg"
import XxX from "./../img/twitter.png"

const Mobile = () => {
    
    return (
        <>
            <main> 
                <div className="mobile">
                    <div className="mobile__logo">
                        <img className="mobile__img" src={MiniLogo} alt="mini logo" />
                    </div>

                    <div className="mobile__text">
                        The Range Bet platform is designed for a screen width of 1920px
                    </div>    

                    <div className="mobile__links">
                        <a target='_blank' href="https://t.me/rangebetcasino">
                            <img src={Telegram} alt="telegram"/>
                        </a>
                        <a target='_blank' href="https://twitter.com/RangeBet">
                            <img src={XxX} alt="X"/>
                        </a>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Mobile;