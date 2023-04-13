'use client';
import { AiOutlineMenu } from 'react-icons/ai'; // import icons from react-icons
import Avatar from '../Avatar';
import { useCallback, useState } from 'react'; // useState and useCallback are hooks
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';

const UserMenu = () => {

    const registerModal = useRegisterModal(); // useRegisterModal is a custom hook that returns an object with isOpen and onClose
    const [isOpen, setIsOpen] = useState(false); // useState is a hook that returns a stateful value and a function to update it

    const toggleOpen = useCallback(() => { // useCallback is a hook that returns a memoized version of the callback that only changes if one of the dependencies has changed
        setIsOpen((value) => !value); // setIsOpen is a function that takes in a value and sets the state to that value
    }, []); // [] is a dependency array that tells the hook to only run once

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => { }}
                    className="
                hidden
                md:block
                text-sm
                font-semibold
                py-3
                px-4
                rounded-full
                hover:bg-neutral-100
                transition
                cursor-pointer
                ">
                    Airbnb your home
                </div>
                <div
                    onClick={toggleOpen}
                    className="
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                    ">
                    <AiOutlineMenu size={18} />
                    <div className='hidden md:block'>
                        <Avatar
                            src="/../public/images/placeholder.jpg"
                        />

                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="
                    absolute
                    rounded-xl
                    shawdow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white
                    overflow-hidden
                    right-0
                    top-12
                    text-sm
                    ">
                    <div className="flex flex-col cursor-pointer">
                        <>
                            <MenuItem
                                onClick={() => { }}
                                label="Login"
                            />
                            <MenuItem
                                onClick={registerModal.onOpen}
                                label="Sign Up"
                            />
                        </>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;