import React, {memo} from 'react';

import "./card-sidebar.scss"

const CartSidebar = ({onClose, isOpen}) => {
    return (
        <div className={`right-sidebar ${isOpen ? "sidebar-open" : "sidebar-close"}`}>
            <div onClick={onClose} className="backdrop"></div>

            <div>
        <div className="card-sidebar">

                sdfklsdfj

                sdkfljsdf

                sdfasasdasd
                asd
                dasd

            </div>

        </div>
        </div>
    );
};

export default memo(CartSidebar);