<?php
	/**
	 * Redirect to chrome extension
	 * This is due to LoveCoding.tv not allowing redirects to chrome-extensions
	 */
	header("Location: " . "chrome-extension://lamnllmdnpadbhconapjiapmnpklmgbm/message.html?auth&" . $_SERVER['QUERY_STRING']);
	exit;
