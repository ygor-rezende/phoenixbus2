const logger = require("firebase-functions/logger");
const { sendMail } = require("./controllers/emailController");
const requestInvoicePdf = require("./controllers/createAttachment");

const emailClient = async (emailData, servicesData, transactionsData) => {
  //Request invoice pdf creation
  const filename = await requestInvoicePdf(
    emailData,
    servicesData,
    transactionsData
  );

  //Create attachment options
  let attachmentAddress = `${process.env.PDFFOLDERPATH}/${filename}`;
  let attachmentOptions = {
    filename: `Invoice${emailData.invoice}.pdf`,
    path: attachmentAddress,
  };

  const mailOptions = {
    from: process.env.SMTPUSER,
    to: emailData.email,
    subject: `Invoice ${emailData.invoice}: Final Balance`,
    html: `<html>
    <div>
    <p>Dear ${emailData.contact},</p>
    <p>Attached we are resending the invoice ${emailData.invoice} for the transportation service. Would you be the right person to receive this invoice, or would you have the responsible person whom I could also forward this invoice? Maybe the Bookkeeper or the District Accounting person?</p>
    <p>Have a Blessed Day</p>
    <p>Phoenix Bus Team</p>
    <p></p>
    </div>
    <div dir="ltr"><div dir="ltr"><p style="margin:0in 0in 0.0001pt;font-family:Calibri,sans-serif"><br></p>
    <p style="color:rgb(34,34,34);margin:0in 0in 0.0001pt;font-size:11pt;font-family:Calibri,sans-serif"><b style="font-size:11pt"><i><span style="font-size:14pt;color:rgb(23,54,93)">Phoenix Bus, Inc<span style="font-family:verdana,sans-serif"> -&nbsp;</span></span></i></b><b style="font-size:11pt"><i><font color="#0000ff"><span style="font-family:verdana,sans-serif"><a href="https://mail.google.com/mail/u/1/%E2%80%8Bhttps://g.page/PhoenixBus?share" style="color:rgb(17,85,204)" target="_blank">Share</a></span></font></i></b><b style="font-size:11pt"><i><span style="font-size:14pt;color:rgb(23,54,93)"><span style="font-family:verdana,sans-serif"></span></span></i></b></p>
    <p style="color:rgb(34,34,34);margin:0in 0in 0.0001pt"><font color="#000000" face="Calibri, sans-serif"><span style="font-size:14.6667px"><i>3220 37th Street</i></span></font><span style="font-size:14.6667px;color:rgb(0,0,0);font-family:Calibri,sans-serif"><i>&nbsp;</i></span><font color="#000000" face="Calibri, sans-serif"><span style="font-size:14.6667px"><i>Orlando, FL&nbsp;</i></span></font><i style="color:rgb(0,0,0);font-family:Calibri,sans-serif;font-size:14.6667px">32839</i></p>
    <p style="color:rgb(34,34,34);margin:0in 0in 0.0001pt;font-size:11pt;font-family:Calibri,sans-serif"><b><i><span style="color:black">Main:&nbsp;</span></i></b><b><i><font color="#0000ff">407-574-7662 - Orlando Office</font></i></b></p>
    <p style="color:rgb(34,34,34);margin:0in 0in 0.0001pt;font-size:11pt;font-family:Calibri,sans-serif"><b><i><font color="#0000ff"><span style="font-family:verdana,sans-serif"></span></font></i></b><b style="font-size:11pt"><i><span style="color:black">Toll Free:&nbsp; &nbsp;</span></i></b><b style="font-size:11pt"><i><font color="#0000ff">888-755-5398<span style="font-family:verdana,sans-serif"> </span></font></i></b><b style="font-size:11pt"><i><font color="#000000">Fax:&nbsp;&nbsp;</font><font color="#0000ff">321-684-5198</font></i></b></p>
    <p style="color:rgb(32,33,36);margin:0in 0in 0.0001pt"><font color="#2f3941" face="garamond, times new roman, serif"><span style="font-size:14px"><b><i>NPC 941-200-6300&nbsp; -&nbsp;</i></b></span></font><b style="font-size:14px;color:rgb(47,57,65);font-family:garamond,&quot;times new roman&quot;,serif"><i>JAX 904-299-9669&nbsp; -&nbsp;</i></b><b style="font-size:14px;color:rgb(47,57,65);font-family:garamond,&quot;times new roman&quot;,serif"><i>TALLY 850-610-8002&nbsp;</i></b></p>
    <p style="color:rgb(32,33,36);margin:0in 0in 0.0001pt"><font color="#2f3941" face="garamond, times new roman, serif"><span style="font-size:14px"><b><i>DAT 386-232-5005&nbsp; -&nbsp;</i></b></span></font><b style="font-size:14px;color:rgb(47,57,65);font-family:garamond,&quot;times new roman&quot;,serif"><i>MIA 305-224-6444 -&nbsp;</i></b><b style="font-size:14px;color:rgb(47,57,65);font-family:garamond,&quot;times new roman&quot;,serif"><i>TPA 813-305-0504&nbsp;</i></b></p>
    <table cellpadding="0" cellspacing="0" style="color:rgb(255,255,255);font-size:medium;vertical-align:-webkit-baseline-middle;font-family:Arial"><tbody><tr><td><table cellpadding="0" cellspacing="0" style="vertical-align:-webkit-baseline-middle;font-family:Arial"><tbody><tr><td style="vertical-align:top"><table cellpadding="0" cellspacing="0" style="vertical-align:-webkit-baseline-middle;font-family:Arial"><tbody><tr><td style="text-align:center"><table cellpadding="0" cellspacing="0" style="vertical-align:-webkit-baseline-middle;font-family:Arial;display:inline-block"><tbody><tr><td><a href="https://www.facebook.com/PhoenixBusOrlando/" color="#6a78d1" style="color:rgb(17,85,204);display:inline-block;padding:0px;background-color:rgb(106,120,209)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/PhoenixBusOrlando/&amp;source=gmail&amp;ust=1718391698069000&amp;usg=AOvVaw0krAK4OdNLJ4Xaq6fRZC0S"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZ31p5u5NZ1dapJksjDy3rtzMKcCBdOWcjtj9qhhyeAeOO_vokWgUwVyiSnq2IbgfDSF2XEn5EHQv7s_PMeTJQ3Q-8hOqGR4M0dhFuK7kPnFaXWLAcCn7JeGJHVW6sBM0mYSY8CgS9bcozDtv07cS977A=s0-d-e1-ft#https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png" alt="facebook" color="#6a78d1" height="24" style="max-width:135px;display:block" class="CToWUd" data-bit="iit"></a></td>
    <td width="5"><div></div></td><td><a href="http://twitter.com/phoenixbusorl" color="#6a78d1" style="color:rgb(17,85,204);display:inline-block;padding:0px;background-color:rgb(106,120,209)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://twitter.com/phoenixbusorl&amp;source=gmail&amp;ust=1718391698070000&amp;usg=AOvVaw0kUEHPqD9m4mi64GEomzzL"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZ4M07tr4ZGgZOV2RJs-HHsT1_-f_GD6LpMYIboU44O6GqUZE6BSBJpvBUBDg-4wQkC-fYQj5mMWPbhJG1D9r7zsrfSoqiHeM3FmCVTlWb93gYegGk2lyAH4gaRoJIvxd-KAeV3_Y1_6BKqc3yzfgl4=s0-d-e1-ft#https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png" alt="twitter" color="#6a78d1" height="24" style="max-width:135px;display:block" class="CToWUd" data-bit="iit"></a></td>
    <td width="5"><div></div></td><td><a href="https://www.youtube.com/channel/UCCZCMRM_E3Sr47UKyLycW9w" color="#6a78d1" style="color:rgb(17,85,204);display:inline-block;padding:0px;background-color:rgb(106,120,209)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.youtube.com/channel/UCCZCMRM_E3Sr47UKyLycW9w&amp;source=gmail&amp;ust=1718391698070000&amp;usg=AOvVaw2Adh3xS28K1Eg6Xofq7Dd4"><img src="https://ci3.googleusercontent.com/meips/ADKq_NYT8BfWNsRN4v5JOhfHfA8aLVh3vYo8ZnseBQV8y2Wn6CqNGq1rWSzCt1Zcz9wI-XI4LOppNDTi05OEcg7Xm_NvU8OhZZcfr1PIJNxZHjuqwAFXaUwtmDi-S9tujrAFp_F8q5DqzY8-Ew9BYE-kTUpXog=s0-d-e1-ft#https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png" alt="linkedin" color="#6a78d1" style="max-width:135px;display:block" class="CToWUd" data-bit="iit"></a></td><td width="5"><div></div></td><td><a href="https://www.instagram.com/phoenixbusorlando/" color="#6a78d1" style="color:rgb(17,85,204);display:inline-block;padding:0px;background-color:rgb(106,120,209)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/phoenixbusorlando/&amp;source=gmail&amp;ust=1718391698070000&amp;usg=AOvVaw1lQEpVWewbE9A7tklgb1HT"><img src="https://ci3.googleusercontent.com/meips/ADKq_NYe-mNRNJnDlJ9cNAdUmwHhTapshvlO2YFbh3xyDprmpQIVi-oZjvOFVB9U2CIf5f0ZSiffze3es0KsPfFf3JP7NakmKl6HQCb8RwoyK3iEEhY8XZ2XeGZ9gzygy8wtuCf_RDcJyJ1IwTfNooSZXL1I1lo=s0-d-e1-ft#https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png" alt="instagram" color="#6a78d1" height="24" style="max-width:135px;display:block" class="CToWUd" data-bit="iit"></a></td><td width="5"><div></div></td></tr>
    </tbody></table></td></tr></tbody></table></td><td width="46"><div></div></td><td style="padding:0px;vertical-align:middle"><span style="font-family:verdana,sans-serif"></span></td></tr></tbody></table></td></tr></tbody></table></div><div dir="ltr" style="color:rgb(34,34,34)"><table cellpadding="0" cellspacing="0" style="color:rgb(255,255,255);font-size:medium;vertical-align:-webkit-baseline-middle;font-family:Arial;width:240.75px"><tbody><tr></tr></tbody></table><p style="font-size:11pt;margin:0in 0in 0.0001pt;font-family:Calibri,sans-serif"><b style="font-size:11pt;color:rgb(0,0,0)"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZGqZpZSOlfR5AajvsChLdZbrnSVR2d4IQAkYc3edtp6BEYtG7fjC-ktUMy8abFV5y7sHbqPKRKPSBkQe1Ywh264CzZFiR61HpLdpn11VM5R06dYcsJXcCQMulmvrVZyzsd-QycQee0Oy80uax1RLuzL7P5JfMgoB4fbzRHG9Sm1aFvvP232zEMnAVmgKA=s0-d-e1-ft#http://static.wixstatic.com/media/9c7743_0de35110a937425d98ff7c780d1c5160.png_srz_p_300_126_75_22_0.50_1.20_0.00_png_srz" width="200" height="83" class="CToWUd" data-bit="iit"></b></p>
    </div></div></html>`,
    attachments: [attachmentOptions],
  };

  const response = await sendMail(mailOptions);
  return response;
};

const emailAdmin = async (data) => {
  let text = data.join("\n");
  logger.log("Admin email text: ", text);
  const mailOptions = {
    from: process.env.SMTPUSER,
    to: process.env.SMTPUSER,
    subject: `Client email reminder results`,
    text: text,
  };

  const response = await sendMail(mailOptions);
  return response;
};

module.exports = { emailClient, emailAdmin };
