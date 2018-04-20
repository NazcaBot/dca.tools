let row = (data) => {
    return `
<tr>
  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
    <div class="layer_2" style="max-width: 600px; display: inline-block; vertical-align: top; width: 100%;">
      <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse; width: 100%; background-color: #f9f9f9;">
        <tbody>
          <tr>
            <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 14px; font-family: Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">
              <p style="line-height: 1em; margin: 0px; padding: 0px;">
                <strong>
                  <span style="font-size: 18px;">${data[0]}
                  </span>
                </strong>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
  </td>
</tr>
<tr>
  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
    <div class="layer_2" style="display: inline-block; vertical-align: top; width: 100%; max-width: 600px;">
      <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">
        <tbody>
          <tr>
            <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 14px; font-family: Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">
              <p style="margin: 0px; padding: 0px;">
                Your current position is <strong>${data[2]}</strong> and you paid an average of <strong>${data[1]}</strong> for it.
              </p>
              <p style="margin: 0px; padding: 0px;">
                <br>
              </p>
              <p style="margin: 0px; padding: 0px;">
                If you buy <strong>${data[4]}</strong> at <strong>${data[3]}</strong>, you will&nbsp;reduce your loss from <strong>${data[6]}</strong> to <strong>${data[5]}</strong>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
  </td>
</tr>
<tr>
  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
    <div class="layer_2" style="display: inline-block; vertical-align: top; width: 100%; max-width: 600px;">
      <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">
        <tbody>
          <tr>
            <td valign="top" class="breakline" style="padding:0">
              <div style="border-style: dashed none none; border-width: 1px 0px 0px; margin-top: 8px; margin-bottom: 8px; border-top-color: #5f5f5f;">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
  </td>
</tr>
`
}

module.exports = (rows) => {
    rows = rows.map((r) => row(r)).join('')
    return `
<!DOCTYPE html PUBLIC " -//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <style type="text/css">body, html {
      width: 100% !important;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: none;
      -ms-text-size-adjust: 100%;
    }
      table td, table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      #outlook a {
        padding: 0;
      }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
        line-height: 100%;
      }
      .ExternalClass {
        width: 100%;
      }
      @media only screen and (max-width: 480px) {
        table, table tr td, table td {
          width: 100% !important;
        }
        img {
          width: inherit;
        }
        .layer_2 {
          max-width: 100% !important;
        }
      }
    </style>
  </head>
  <body style="padding:0; margin: 0;">
    <table style="height: 100%; width: 100%; background-color: #efefef;" align="center">
      <tbody>
        <tr>
          <td valign="top" id="dbody" data-version="2.30" style="width: 100%; height: 100%; padding-top: 30px; padding-bottom: 30px; background-color: #efefef;">
            <!--[if (gte mso 9)|(IE)]><table align="center" style="max-width:600px" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
            <table class="layer_1" align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; box-sizing: border-box; width: 100%; margin: 0px auto;">
              <tbody>
                <tr>
                  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
                    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
                    <div class="layer_2" style="max-width: 600px; display: inline-block; vertical-align: top; width: 100%;">
                      <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">
                        <tbody>
                          <tr>
                            <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 14px; font-family: Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">
                              <p style="margin: 0px; padding: 0px;">
                                <span style="font-size: 24px;">Here's your saved dca.tools calculation!
                                </span>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
                ${rows}
                <tr>
                  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
                    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
                    <div class="layer_2" style="max-width: 600px; display: inline-block; vertical-align: top; width: 100%;">
                      <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">
                        <tbody>
                          <tr>
                            <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 14px; font-family: Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">
                              <p style="margin: 0px; padding: 0px;"><strong></strong>Thanks for using <strong>DCA.tools</strong>, we wish you the best with your trading and a <em>quick recovery!</em>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
                <tr>
                  <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">
                    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
                    <div class="layer_2" style="max-width: 600px; display: inline-block; vertical-align: top; width: 100%;">
                      <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">
                        <tbody>
                          <tr>
                            <td valign="top" class="emptycell" style="padding: 10px;">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
                <tr>
                  <td class="drow" valign="top" align="center" style="background-color: #efefef; box-sizing: border-box; font-size: 0px; text-align: center;">
                    <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->
                    <div class="layer_2" style="max-width: 600px; display: inline-block; vertical-align: top; width: 100%;">
                      <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">
                        <tbody>
                          <tr>
                            <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 14px; font-family: Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">
                              <p style="text-align: center; font-size: 10px; margin: 0px; padding: 0px;">If you no longer wish to receive mail from us, you can 
                                <a href="{unsubscribe}" style="background-color: initial; font-size: 10px; color: #3498db; text-decoration: none;">Unsubscribe</a> <br>{accountaddress}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}