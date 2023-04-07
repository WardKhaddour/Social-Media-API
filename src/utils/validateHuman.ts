const validateHuman = async (token: string): Promise<boolean> => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    let data;
    const response = await fetch(url, {
      method: 'POST',
    });
    try {
      data = await response.json();
    } catch (err) {
      data = null;
      return false;
    }
    return data.success;
  } catch (err) {
    return false;
  }
};

export default validateHuman;
