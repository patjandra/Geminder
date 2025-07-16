import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

export default function Login({ onLogin}) {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            onLogin(user);
        } catch (error) {
            console.error("Sign-in error:", error);
            alert("Failed to sign in. Please try again.");
        }
    };

    const handleContinueWithoutLogin = () => {
        onLogin({ displayName: "Guest" });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-lightGray">
            {/* Login Square */}
            <div className="bg-darkGray w-[500px] h-[500px] rounded-lg shadow-md text-center p-6">
                <img src="../../public/GeminderLogo.png" alt="Geminder Logo" className="h-20 w-auto mt-3 mb-14 mx-auto" />

                <button 
                    onClick={handleLogin}
                    className="bg-geminderBlue hover:bg-blue-600 text-white text-xl font-semibold py-4 px-4 rounded-xl w-3/4 mt-3 mx-auto"
                >
                    Sign in with Google
                </button>

                <img src="../../public/OrLoginElem.png" alt="Or Login Element" className="w-3/4 mt-10 mb-10 mx-auto" />

                <button
                    onClick={handleContinueWithoutLogin}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-500 text-xl font-semibold py-4 px-4 rounded-xl h- w-3/4 mx-auto"
                >
                    Continue without login
                </button>
            </div>
        </div>
    );
}