import React from 'react';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    maxWidth: 800,
    margin: '20px auto',
    padding: 20,
  },
};
const Help = ({ classes }) => {
  const domain = window.location.origin;
  return (
    <Paper className={classes.container}>
      <h2>About</h2>
      <p>
        Go is a tool to quickly find sites used by an organisation. It allows
        you to create short keyword urls for pages that everyone can use to
        quickly navigate internal and external urls.
      </p>
      <p>
        Everyone can add a url to go if they think it will be useful to
        themselves or others
      </p>
      <h2>Setup</h2>
      <p>
        There are two options to setup. Setting up the url to search with{' '}
        {domain}/test or adding a search engine keyword "go".
      </p>
      <h3>Search Engine Keyword</h3>
      <p>
        The page should already have added a search engine to your browser, but
        you will probably need to edit the keyword. In Chrome, right click the
        url bar, select "Edit Search Engines...", find the one for Go (the url
        you are currently on), then edit it to make sure the keyword is "go" and
        the url is "{domain}/%s"
      </p>
      <p>
        After setting this up you should be able to just type "go" into the
        search bar, followed by a space, then the key you want.
      </p>
      <h3>Hosts file</h3>
      <p>
        On Mac, open /etc/hosts as root, and add a line with the current domain
        name, followed by "go", so it should look something like "{domain} go"
      </p>
      <h2>Searching and Adding New</h2>
      <p>
        Go supports single links (a key mapping to a url), alias (a key mapping
        to another key), and an alias mapping to multiple links.
      </p>
      <h3>Single links</h3>
      <p>
        To add a single link just type in the key, then the url. If the url
        already exists it is recommended to use an alias if you just want a
        different key, as if the url ever changes, updating the original will
        update them all.
      </p>
      <h3>Alias</h3>
      <p>
        To add an alias, type in the key as before and specify the key for
        another url in the url/alias field
      </p>
      <h3>Multiple</h3>
      <p>
        To add a key that opens multiple pages type in a key name, then separate
        the aliases with commas in the url/alias field. Multiple links can only
        be added using aliases.
      </p>
      <p>
        You can also manually open multiple links without needing to create a
        key just by comma separating keys, e.g. {domain}/one,two,three
      </p>
    </Paper>
  );
};

export default withStyles(styles)(Help);
