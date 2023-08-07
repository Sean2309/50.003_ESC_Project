class StringFuzzer {
    constructor(membershipFormat) {
      this.membershipFormat = membershipFormat;
    }
  
    generateRandomMembershipId(length) {
      const regex = RegExp(this.membershipFormat);
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    // produced membershipId is not of the intended format
    // so we can use as a fuzzer
      if (!regex.test(result)) {
        return result;
      } else {
        // valid member, redo
        return this.generateRandomMembershipId(length);
      }
    }
  }

module.exports = StringFuzzer;