export const selectionCalc = (selectedIndex:number, n:number)=>{
    return {
        up:(selectedIndex + n - 1) % n,
        down:(selectedIndex + 1) % n,
    }
}