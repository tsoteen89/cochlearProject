- First assuming you already have cochlearProject on your local machine.

- Next you need ssh access to the server (aii-hermes.org) and I will check that everyone is a user with the right permissions.

- You need to copy a local ssh key to the server so you can connect WITHOUT typing your password. You should already have one generated, so switch to your `.ssh` directory and do the following.
- You can copy the public key into the new machine's authorized_keys file with the `ssh-copy-id` command. Make sure to replace the example username and IP address below.

```bash
ssh-copy-id you@aii-hermes.org
```

If that doesn't work, try the following:

```bash
cat ~/.ssh/id_rsa.pub | ssh you@aii-hermes.org "mkdir -p ~/.ssh && cat >>  ~/.ssh/authorized_keys"
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

I assume that the web site will live on a server to which you have ssh access, and that things are set up so that you can ssh to it without having to type a password (i.e., that your public key is in ~/.ssh/authorized_keys and you are running ssh-agent locally).
On the server, we create a new repository to mirror the local one.
$ mkdir website.git && cd website.git
$ git init --bare
Initialized empty Git repository in /home/ams/website.git/
Then we define (and enable) a post-receive hook that checks out the latest tree into the web server's DocumentRoot (this directory must exist; Git will not create it for you):
$ mkdir /var/www/www.example.org
$ cat > hooks/post-receive
#!/bin/sh
GIT_WORK_TREE=/var/www/www.example.org git checkout -f
$ chmod +x hooks/post-receive
Note: earlier versions of this howto depended on setting the git config variables core.worktree to the target directory, core.bare to false, and receive.denycurrentbranch to ignore. But these changes are not needed if you use GIT_WORK_TREE (which didn't work when I first wrote the howto), and the remote repository can remain bare.
Back on the workstation, we define a name for the remote mirror, and then mirror to it, creating a new "master" branch there.
$ git remote add web ssh://server.example.org/home/ams/website.git
$ git push web +master:refs/heads/master
On the server, /var/www/www.example.org should now contain a copy of your files, independent of any .git metadata.
The update process

Nothing could be simpler. In the local repository, just run
$ git push web
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
