"use client";

interface FormToggleProps {
  isSignUp: boolean;
  onToggle: () => void;
}

const FormToggle: React.FC<FormToggleProps> = ({
  isSignUp,
  onToggle,
}) => {
  return (
    <div className="mt-8 text-center">
      <p className="text-black/50">
        {isSignUp
          ? "Already have an account?"
          : "Don't have an account?"}

        <button
          type="button"
          onClick={onToggle}
          className="
            ml-2
            font-medium
            text-black
            transition-opacity
            hover:opacity-60
          "
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default FormToggle;
