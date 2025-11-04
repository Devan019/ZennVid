export const getToday = ():string => {
  const today = new Date()
  const todaystr:string = today.getDay().toString() + "-" + today.getMonth().toString() + "-" + today.getFullYear().toString();

  return todaystr;
}