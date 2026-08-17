# frozen_string_literal: true

require "digest"

# Article URLs use the MD5 digest of the source Markdown file. The digest is
# calculated on every build and is never written back to the source file.
Jekyll::Hooks.register :posts, :post_read do |document|
  digest = Digest::MD5.file(document.path).hexdigest
  document.data["permalink"] = "/#{digest}/"
end
