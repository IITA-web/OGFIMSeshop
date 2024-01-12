import { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const atLeastOneUppercase = /[A-Z]/g; // capital letters from A to Z
const atLeastOneLowercase = /[a-z]/g; // small letters from a to z
const atLeastOneNumeric = /[0-9]/g; // numbers from 0 to 9
const atLeastOneSpecialChar = /[#?!@$%^&*-.]/g; // any of the special characters within the square brackets
const eightCharsOrMore = /.{8,}/g; // eight characters or more

interface PasswordInputProps {
  value: string;
  id: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string, name: string) => void;
  className?: string;
  showMeter?: boolean;
  showPasswordMatch?: boolean;
  passwordMatch?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  showMeter = true,
  onChange,
  showPasswordMatch = false,
  passwordMatch = "",
  value = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [checkMatch, setCheckMatch] = useState<string>("");

  const handleMeter = (password: string): number => {
    const passwordTracker = {
      uppercase: atLeastOneUppercase.test(password),
      lowercase: atLeastOneLowercase.test(password),
      number: atLeastOneNumeric.test(password),
      specialChar: atLeastOneSpecialChar.test(password),
      eightCharsOrGreater: eightCharsOrMore.test(password),
    };

    return Object.values(passwordTracker).filter((value) => value).length;
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    if (showMeter) {
      setPasswordStrength(handleMeter(target.value));
    }

    if (showPasswordMatch) {
      if (passwordMatch !== "" && target.value !== "") {
        setCheckMatch(
          target.value === passwordMatch
            ? "Passwords match"
            : "Passwords do not match"
        );
      } else {
        setCheckMatch("");
      }
    }

    onChange(target.value, target.name);
  };

  const handleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative">
        <input
          value={value}
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          onChange={handlePasswordChange}
          {...rest}
        />
        <div
          className="absolute top-3.5 right-3 flex flex-row gap-2 text-sm cursor-pointer items-center mt-2 pl-1"
          onClick={handleVisibility}
        >
          {showPassword ? (
            <AiOutlineEye className="text-[#457A40] text-lg" />
          ) : (
            <AiOutlineEyeInvisible className="text-[#457A40] text-lg" />
          )}
        </div>
      </div>

      {showMeter && (
        <div className="mt-2">
          <ul className="flex items-center gap-2">
            {new Array(5).fill("").map((_, index) => {
              return (
                <li
                  key={index}
                  className={`h-1 rounded-sm flex-1 ${
                    passwordStrength > index
                      ? [
                          "bg-red-500",
                          "bg-orange-500",
                          "bg-yellow-400",
                          "bg-green-600",
                          "bg-green-800",
                        ][passwordStrength - 1]
                      : "bg-gray-300"
                  }`}
                />
              );
            })}
          </ul>
          {passwordStrength > 0 && (
            <p className="text-sm text-end mt-1">
              {
                [
                  "Very Weak",
                  "Weak",
                  "Fair",
                  "Strong",
                  "Very Strong",
                  "Excellent",
                ][passwordStrength]
              }
            </p>
          )}
        </div>
      )}

      {showPasswordMatch && (
        <p
          className={`text-sm text-end mt-1 text-green-600 ${
            checkMatch === "Passwords do not match" && "text-red-500"
          }`}
        >
          {checkMatch}
        </p>
      )}
    </>
  );
};

export default PasswordInput;
