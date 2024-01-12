class Util {
  constructor() {}

  public phoneFormat = (phone: string): string => {
    phone = phone.replace(/\D/g, "");

    if (phone.length === 10) {
      phone = `+234 (0) ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(
        6
      )}`;
    } else if (phone.length === 11) {
      phone = `+234 (0) ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(
        7
      )}`;
    } else if (phone.length === 13) {
      phone = `+${phone.slice(1, 4)} (0) ${phone.slice(4, 7)} ${phone.slice(
        7,
        10
      )} ${phone.slice(10)}`;
    } else {
      return "your registered phone number";
    }

    return phone;
  };

  public isPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+234|234|0)?\d{10}$/;

    return !!phoneRegex.test(phone);
  };

  public getValidPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0")) {
      return phone.replace("0", "");
    } else if (phone.startsWith("+234")) {
      return phone.replace("+234", "");
    } else if (phone.startsWith("234")) {
      return phone.replace("234", "");
    }

    if (phone.length !== 10) {
      return null;
    }

    return phone;
  };

  public formatMoney = (value: number): string => {
    return `₦${new Intl.NumberFormat("US").format(value)}`;
  };
}

export default new Util();
