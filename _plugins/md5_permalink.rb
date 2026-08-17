# frozen_string_literal: true

require "digest"

# Article URLs use the MD5 digest of the source Markdown file. The digest is
# calculated on every build and is never written back to the source file.
Jekyll::Hooks.register :posts, :post_read do |document|
  # Normalize CRLF checkouts on Windows and LF checkouts on the server so both
  # produce the same article URL.
  source = File.read(document.path, mode: "rb").gsub("\r\n", "\n")
  digest = Digest::MD5.hexdigest(source)
  document.data["permalink"] = "/#{digest}/"
end
