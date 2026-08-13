 # frozen_string_literal: true
 require "digest"
 
 # Auto-generate a deterministic UUID for each post, so permalink
 # can use :uuid without manually adding uuid to Front Matter.
 #
 # The UUID is an 8-char hex hash of the post's date + slug,
 # which stays the same across rebuilds.
 module Jekyll
   class Document
     alias_method :_orig_url_placeholders, :url_placeholders
 
     def url_placeholders
       placeholders = _orig_url_placeholders
       return placeholders if placeholders.key?("uuid")
 
       date_str = data["date"].respond_to?(:strftime) ? data["date"].strftime("%Y%m%d") : ""
       slug     = data["slug"] || basename_without_ext
       placeholders["uuid"] = Digest::MD5.hexdigest("#{date_str}-#{slug}")[0, 8]
       placeholders
     end
   end
 end
