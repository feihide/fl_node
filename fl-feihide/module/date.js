function formatDate(formatStr, fdate)
{
    var fTime, fStr = 'ymdhis';
    if (!formatStr)
        formatStr= "y-m-d h:i:s";
    if (fdate)
        fTime = new Date(fdate);
    else
        fTime = new Date();
    var formatArr = [
        fTime.getFullYear().toString(),
        (fTime.getMonth()+1).toString(),
        fTime.getDate().toString(),
        fTime.getHours().toString(),
        fTime.getMinutes().toString(),
        fTime.getSeconds().toString()
    ]
    for (var i=0; i<formatArr.length; i++)
    {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
    }
    return formatStr;
}

exports.formate = formatDate;