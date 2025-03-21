export const formatCount = (count) => {
    if(count<10000){
        return count
    }
    return (count / 10000).toFixed(1) + '万';
}