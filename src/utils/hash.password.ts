import bcrypt from "bcrypt";

/*  
    Function: hashPassword
    Purpose: Hashes a user's password using bcrypt with a defined number of salt rounds.
    Incoming: { password: string } (the plain text password to be hashed)
    Returns: A promise that resolves to the hashed password.
*/
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  return await bcrypt.hash(password, saltRounds);
};

/*  
    Function: comparePassword
    Purpose: Compares a plain text password with a hashed password to verify if they match.
    Incoming: { userPassword: string, hashedPassword: string } (plain text password and the stored hashed password)
    Returns: A promise that resolves to a boolean indicating whether the passwords match.
*/
export const comparePassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(userPassword, hashedPassword);
};
