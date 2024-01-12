class Util {
  constructor() {}

  static numberUtil(phone: string): string {
    if (phone.startsWith('0')) {
      phone = phone.replace('0', '+234');
    } else if (phone.startsWith('234')) {
      phone = phone.replace('234', '+234');
    } else if (phone.length === 10) {
      phone = `+234${phone}`;
    } else {
      phone = `+${phone}`;
    }

    return phone;
  }

  static number2Util(phone: string): string {
    if (phone.startsWith('+234')) {
      phone = phone.replace('+234', '0');
    } else if (phone.startsWith('234')) {
      phone = phone.replace('234', '0');
    } else if (phone.length === 10) {
      phone = `0${phone}`;
    }

    return phone;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);

    result.setDate(result.getDate() + days);
    return result;
  }

  static calculateRemainingDays(futureDate: Date): number {
    futureDate = new Date(futureDate);

    const currentDate = new Date();
    const date = futureDate.getDate() - currentDate.getDate();

    return date || 0;
  }
}

export default Util;
