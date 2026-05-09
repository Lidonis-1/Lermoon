import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // Встановлення фокусу на поле імені при завантаженні
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // Валідація імені користувача
    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    // Валідація пароля та перевірка на збіг
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        // Порівнюємо паролі та перевіряємо, чи вони не порожні
        const match = pwd === matchPwd && matchPwd !== '';
        setValidMatch(match);
    }, [pwd, matchPwd])

    // Очищення помилки при зміні вводу
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Додаткова перевірка перед відправкою (безпека)
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Некоректні дані");
            return;
        }
        console.log(user, pwd);
        setSuccess(true);
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Успіх!</h1>
                    <p>
                        <a href="#">Увійти</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p>
                    <h1>Реєстрація</h1>
                    <form onSubmit={handleSubmit}>
                        {/* USERNAME */}
                        <label htmlFor="username">
                            Користувач:
                            <span className={validName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validName || !user ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Від 4 до 24 символів.<br />
                            Має починатися з літери.<br />
                            Дозволені літери, цифри, підкреслення, дефіси.
                        </p>

                        {/* PASSWORD */}
                        <label htmlFor="password">
                            Пароль:
                            <span className={validPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Від 8 до 24 символів.<br />
                            Має містити великі та малі літери, цифру та спецсимвол.<br />
                            Дозволені спецсимволи: ! @ # $ %
                        </p>

                        {/* CONFIRM PASSWORD */}
                        <label htmlFor="confirm_pwd">
                            Підтвердьте пароль:
                            <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Має збігатися з першим полем пароля.
                        </p>

                        {/* Кнопка активна тільки якщо всі поля валідні */}
                        <button disabled={!validName || !validPwd || !validMatch}>
                            Зареєструватися
                        </button>
                    </form>

                    <p>
                        Вже зареєстровані?<br />
                        <span className="line">
                            <a href="#">Увійти</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register;