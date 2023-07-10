import {ReactNode} from 'react';

import toast from 'react-hot-toast';

const useCustomToast = () => {
    return function (msg: ReactNode, isError = false) {

        return toast.custom((t) => <div className="">
            <div
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } 
                 ${isError ? "bg-red-400 " : "bg-gray-800" }
                 max-w-md w-full  shadow-lg rounded pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex px-4" style={{borderRight: "2px solid #f77216"}}>
                    <p className="text-sm text-white">
                        {msg}
                    </p>

                    {/*<div className="border-l border-gray-200">*/}
                    {/*    <button*/}
                    {/*        onClick={() => toast.dismiss(t.id)}*/}
                    {/*        className=""*/}
                    {/*    >*/}
                    {/*        Close*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                </div>

            </div>
        </div>, {
            position: "top-right"
        })

    }
};

export default useCustomToast;