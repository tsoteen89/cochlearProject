### Part one - Getting ssh set up:

- First assuming you already have cochlearProject on your local machine.
- Next you need ssh access to the server (aii-hermes.org) and I will check that everyone is a user with the right permissions to access the folder `/var/www/aii-hermes-dev` which is where we will be pushing to.
- Anywhere you see `griffin` replace it with your username.
- Also in my snippets, commands start with `$` output from commands doesn't

- You need to copy a local ssh key to the server so you can connect WITHOUT typing your password. You should already have one generated, so switch to your `.ssh` directory and copy the public key into the new machine's `authorized_keys` file with the `ssh-copy-id` command. 

```bash
$ cd ~/.ssh
$ ssh-copy-id griffin@aii-hermes.org
```

If that doesn't work, try the following:

```bash
cat ~/.ssh/id_rsa.pub | ssh griffin@aii-hermes.org "mkdir -p ~/.ssh && cat >>  ~/.ssh/authorized_keys"
```

No matter which method you use, you should see something like what I saw:

```
The authenticity of host 'aii-hermes.org (127.0.1.1)' can't be established.
ECDSA key fingerprint is ac:03:e5:19:d3:de:67:c3:5d:38:7f:c3:85:00:4d:ec.
Are you sure you want to continue connecting (yes/no)? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
griffin@aii-hermes.org's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'griffin@aii-hermes.org'"
and check to make sure that only the key(s) you wanted were added.
```

Or, from another tutorial, you might see: 

```
The authenticity of host '12.34.56.78 (12.34.56.78)' can't be established.
RSA key fingerprint is b1:2d:33:67:ce:35:4d:5f:f3:a8:cd:c0:c4:48:86:12.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '12.34.56.78' (RSA) to the list of known hosts.
user@12.34.56.78's password: 
Now try logging into the machine, with "ssh 'user@12.34.56.78'", and check in:

  ~/.ssh/authorized_keys

to make sure we haven't added extra keys that you weren't expecting.
```

__Either way, you should be able to log into aii-hermes.org and not get prompted for a password.__

### Part two, create a "mirror" in your own folder:

- On the server, we create a new repository to mirror the local one.
- Goto your home directory on aii-hermes. I created a folder in `/home/griffin/` called `aii-hermis.git`
- So create that folder and open it, then create an empty git repo:

```bash
$ cd /home/griffin
$ mkdir aii-hermes.git
$ cd aii-hermes.git
$ git init --bare

Initialized empty Git repository in /home/griffin/aii-hermis.git/
```

__Up to now we have:__

- Initialized an empty Git repository in `/home/griffin/aii-hermes.git` and
- You can log into aii-hermes.org without getting prompted for a password.

### Part 3 - Post receive hook

Now we define (and enable) a post-receive hook that checks out the latest tree into the `/var/www/aii-hermes-dev` folder.

- Assuming `/var/www/aii-hermes-dev` exists and
- Assuming your empty git repository is: `/home/griffin/aii-hermes.git`
- The following command _creates_ the file `post-receive`. It's not in the hooks folder yet.
```
$ nano /home/griffin/aii-hermes.git/hooks/post-receive
```

- Paste the following into this post-receive file:

```
#!/bin/sh
GIT_WORK_TREE=/var/www/aii-hermes-dev git checkout -f
```

- Save the file
- Now change the permissions to make it executable:

```
$ chmod +x /home/griffin/aii-hermes.git/hooks/post-receive
```

### To repeat yet again:)

- You can log into aii-hermes.org without getting prompted for a password.
- You have a folder called `/home/griffin/aii-hermis.git` that has an empty git repository & a file called `post-receive` in the hooks folder with bash stuff in it.
- The `post-receive` file is executable.

### Now back on your laptop

- We need to define a name for the remote mirror, and then ... mirror to it, creating a new "master" branch there.
- Basically instead of `git push origin master` you say `git push origin dev` (dev is my name choice).

```
$ git remote add dev ssh://aii-hermes.org/home/griffin/aii-hermes.git
$ git push dev +master:refs/heads/master
```

On the server, `/var/www/aii-hermes-dev` should now contain a copy of your files, independent of any .git metadata.

### The update process

Nothing could be simpler. In the local repository, just run your normal commits + the new push:

```
$ git add -A 
$ git commit -m "my commit message"
$ git push origin master
$ git push dev
```


This will transfer any new commits to the remote repository, where the post-receive hook will immediately update the DocumentRoot for you.
(This is more convenient than defining your workstation as a remote on the server, and running "git pull" by hand or from a cron job, and it doesn't require your workstation to be accessible by ssh.)
Notes

A few more things bear mentioning.
First, the work tree (/var/www/www.example.org above) must be writable by the user who runs the hook (or the user needs sudo access to run git checkout -f, or something similar).
Also, the work tree does not need to correspond exactly to your DocumentRoot. Your repository may represent only a subdirectory of it, or even contain it as a subdirectory.
In the work tree, you will need to set the environment variable GIT_DIR to the path to website.git before you can run any git commands (e.g. "git status").
Setting receive.denycurrentbranch to "ignore" on the server eliminates a warning issued by recent versions of git when you push an update to a checked-out branch on the server. (Thanks to Miklos Vajna for pointing this out.)
You can push to more than one remote repository by adding more URLs under the [remote "web"] section in your .git/config.
[remote "web"]
    url = ssh://server.example.org/home/ams/website.git
    url = ssh://other.example.org/home/foo/website.git
