import React, {useState} from 'react';

const LoginPage = () => {

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    function handleChange(e) {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e){
        e.preventDefault();



    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">

                <div>
                    <h2>Basic info</h2>
                    <input
                        type="email"
                        onChange={handleChange}
                        name="email"
                        value={userData.email}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={userData.password}
                        placeholder="Password"
                    />
                </div>
                <button>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;