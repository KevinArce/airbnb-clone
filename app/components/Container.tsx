'use client'; // use client side rendering

interface ContainerProps { // interface for props type checking 
    children: React.ReactNode; // ReactNode is a type that can be anything that can be rendered
}

const Container: React.FC<ContainerProps> = ({ // FC is a type that is a function component that takes in props
    children // destructure 
}) => {
    return (
        <div
            className="
                max-w-[2520px]
                mx-auto
                xd:px-20
                md:px-10
                sm:px-2
                px-4
            "
        >
            {children} {/* render children */}
        </div>
    )
}

export default Container;