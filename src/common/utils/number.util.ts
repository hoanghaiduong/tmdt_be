

export class NumberUtil{

    /*
    * @since: 7/29/2023 7:46 PM
    * @description:  Generate random number with length -> value = 4 -> 0-9999
    * @update:
    * */
     public static generateRandomNumber(value:number):number{
         return Math.floor(Math.random() * Math.pow(10, value));
     }
  }